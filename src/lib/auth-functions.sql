
-- Fonction pour créer un utilisateur avec mot de passe haché
CREATE OR REPLACE FUNCTION public.create_user_with_hashed_password(
  user_first_name text,
  user_last_name text,
  user_email text,
  user_password text,
  user_country_id integer,
  user_role_id integer DEFAULT NULL
)
RETURNS TABLE (
  id integer,
  first_name text,
  last_name text,
  email text,
  role_name text,
  country_name text,
  created_at timestamp without time zone,
  updated_at timestamp without time zone
) AS $$
DECLARE
  new_user_id integer;
  default_role_id integer;
BEGIN
  -- Si aucun rôle n'est spécifié, utiliser "Apprenant" par défaut
  IF user_role_id IS NULL THEN
    SELECT r.id INTO default_role_id FROM public.roles r WHERE r.role_name = 'Apprenant' LIMIT 1;
    user_role_id := default_role_id;
  END IF;

  -- Insérer le nouvel utilisateur
  INSERT INTO public.users (
    first_name, 
    last_name, 
    email, 
    password_hash, 
    country_id, 
    role_id,
    created_at,
    updated_at
  ) VALUES (
    user_first_name,
    user_last_name,
    user_email,
    public.hash_password(user_password),
    user_country_id,
    user_role_id,
    now(),
    NULL
  ) RETURNING users.id INTO new_user_id;

  -- Retourner les informations de l'utilisateur avec les noms des relations
  RETURN QUERY
  SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    r.role_name,
    c.name as country_name,
    u.created_at,
    u.updated_at
  FROM public.users u
  LEFT JOIN public.roles r ON u.role_id = r.id
  LEFT JOIN public.countries c ON u.country_id = c.id
  WHERE u.id = new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier la connexion utilisateur
CREATE OR REPLACE FUNCTION public.verify_user_login(
  user_email text,
  user_password text
)
RETURNS TABLE (
  id integer,
  first_name text,
  last_name text,
  email text,
  role_name text,
  country_name text,
  created_at timestamp without time zone,
  updated_at timestamp without time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    r.role_name,
    c.name as country_name,
    u.created_at,
    u.updated_at
  FROM public.users u
  LEFT JOIN public.roles r ON u.role_id = r.id
  LEFT JOIN public.countries c ON u.country_id = c.id
  WHERE u.email = user_email 
    AND public.verify_password(user_password, u.password_hash) = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
