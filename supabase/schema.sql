-- Supabase Database Schema for Gacha Machine Web App
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  tokens INTEGER DEFAULT 0 NOT NULL CHECK (tokens >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gacha items table
CREATE TABLE IF NOT EXISTS gacha_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  drop_rate DECIMAL(5,4) NOT NULL CHECK (drop_rate > 0 AND drop_rate <= 1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gacha history (spin results)
CREATE TABLE IF NOT EXISTS gacha_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES gacha_items(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User inventory (collected items)
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES gacha_items(id) NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL CHECK (quantity > 0),
  UNIQUE(user_id, item_id)
);

-- Transactions table (Midtrans payments)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  tokens_purchased INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'expired')),
  midtrans_transaction_id TEXT,
  payment_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, tokens)
  VALUES (NEW.id, NEW.email, SPLIT_PART(NEW.email, '@', 1), 10);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to perform gacha spin (atomic operation)
CREATE OR REPLACE FUNCTION perform_gacha_spin(p_user_id UUID, p_cost INTEGER)
RETURNS UUID AS $$
DECLARE
  v_tokens INTEGER;
  v_random DECIMAL;
  v_cumulative DECIMAL := 0;
  v_item_id UUID;
  v_item RECORD;
BEGIN
  -- Check and deduct tokens
  SELECT tokens INTO v_tokens FROM profiles WHERE id = p_user_id FOR UPDATE;
  
  IF v_tokens < p_cost THEN
    RAISE EXCEPTION 'Insufficient tokens';
  END IF;
  
  UPDATE profiles SET tokens = tokens - p_cost, updated_at = NOW() WHERE id = p_user_id;
  
  -- Random selection based on drop rates
  v_random := random();
  
  FOR v_item IN SELECT id, drop_rate FROM gacha_items ORDER BY drop_rate DESC LOOP
    v_cumulative := v_cumulative + v_item.drop_rate;
    IF v_random <= v_cumulative THEN
      v_item_id := v_item.id;
      EXIT;
    END IF;
  END LOOP;
  
  -- Fallback: pick the last item if somehow none was selected
  IF v_item_id IS NULL THEN
    SELECT id INTO v_item_id FROM gacha_items ORDER BY drop_rate DESC LIMIT 1;
  END IF;
  
  -- Record history
  INSERT INTO gacha_history (user_id, item_id) VALUES (p_user_id, v_item_id);
  
  -- Update or insert inventory
  INSERT INTO inventory (user_id, item_id, quantity)
  VALUES (p_user_id, v_item_id, 1)
  ON CONFLICT (user_id, item_id)
  DO UPDATE SET quantity = inventory.quantity + 1;
  
  RETURN v_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed gacha items
INSERT INTO gacha_items (name, description, image_url, rarity, drop_rate) VALUES
  ('Bronze Coin', 'A common bronze coin', '/items/bronze-coin.png', 'common', 0.40),
  ('Silver Ring', 'A shiny silver ring', '/items/silver-ring.png', 'common', 0.25),
  ('Emerald Gem', 'A beautiful emerald gem', '/items/emerald-gem.png', 'uncommon', 0.15),
  ('Golden Sword', 'A powerful golden sword', '/items/golden-sword.png', 'rare', 0.10),
  ('Diamond Shield', 'An indestructible diamond shield', '/items/diamond-shield.png', 'rare', 0.05),
  ('Phoenix Feather', 'A mystical phoenix feather', '/items/phoenix-feather.png', 'epic', 0.03),
  ('Dragon Crown', 'Crown of the ancient dragon', '/items/dragon-crown.png', 'epic', 0.015),
  ('Celestial Orb', 'The legendary celestial orb', '/items/celestial-orb.png', 'legendary', 0.005)
ON CONFLICT DO NOTHING;

-- Function to add tokens (used by webhook)
CREATE OR REPLACE FUNCTION add_tokens(p_user_id UUID, p_amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles SET tokens = tokens + p_amount, updated_at = NOW() WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gacha_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gacha_items ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Gacha items: everyone can read
CREATE POLICY "Anyone can view gacha items" ON gacha_items FOR SELECT USING (true);

-- Gacha history: users can view their own
CREATE POLICY "Users can view own gacha history" ON gacha_history FOR SELECT USING (auth.uid() = user_id);

-- Inventory: users can view their own
CREATE POLICY "Users can view own inventory" ON inventory FOR SELECT USING (auth.uid() = user_id);

-- Transactions: users can view their own
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
