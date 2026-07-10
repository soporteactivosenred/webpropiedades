import { createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = (await createServerClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Check if current user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'No tienes permisos de administrador.' }, { status: 403 });
    }

    const { email, password, full_name, phone, role, avatar_url } = await req.json();

    if (!email || !password || !full_name || !role) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json(
        { error: 'La clave secreta SUPABASE_SERVICE_ROLE_KEY no está configurada en el servidor. Por favor configúrala.' },
        { status: 550 }
      );
    }

    // Create admin client using service key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 1. Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const newUserId = authData.user?.id;

    // 2. Update/Upsert user profile (profiles table)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: newUserId,
        email,
        full_name,
        phone: phone || null,
        avatar_url: avatar_url || null,
        role: role as 'admin' | 'agent' | 'user',
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Rollback: delete auth user if profile creation failed
      await supabaseAdmin.auth.admin.deleteUser(newUserId!);
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, userId: newUserId });
  } catch (error: any) {
    console.error('Error in POST /api/admin/users:', error);
    return NextResponse.json({ error: error.message || 'Ocurrió un error interno.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = (await createServerClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Check if current user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'No tienes permisos de administrador.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userIdToDelete = searchParams.get('id');

    if (!userIdToDelete) {
      return NextResponse.json({ error: 'ID de usuario es requerido' }, { status: 400 });
    }

    if (userIdToDelete === user.id) {
      return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta.' }, { status: 400 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json(
        { error: 'La clave secreta SUPABASE_SERVICE_ROLE_KEY no está configurada en el servidor. Por favor configúrala.' },
        { status: 500 }
      );
    }

    // Create admin client using service key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Delete user from auth (profiles row will cascade delete automatically)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userIdToDelete);

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/users:', error);
    return NextResponse.json({ error: error.message || 'Ocurrió un error interno.' }, { status: 500 });
  }
}
