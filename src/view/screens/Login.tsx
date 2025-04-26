import { auth } from '@/configs/firebase';
import { useAuth } from '@/hooks/useAuth';
import { isSignInWithEmailLink } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessingLink, setIsProcessingLink] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginMethod, setLoginMethod] = useState<'password' | 'link'>(
    'password',
  );

  const { sendLoginLink, confirmSignIn, currentUser, loginWithPassword } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (currentUser) {
      navigate(location.state?.from?.pathname || '/');
    }
  }, [currentUser, navigate, location]);

  // Verificar se há um link de login válido
  useEffect(() => {
    const checkEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setIsProcessingLink(true);

        let emailForSignIn = window.localStorage.getItem('emailForSignIn');

        if (!emailForSignIn) {
          emailForSignIn = window.prompt(
            'Por favor, informe seu email para confirmação',
          );
        }

        if (emailForSignIn) {
          try {
            const success = await confirmSignIn(emailForSignIn);
            if (success) {
              navigate('/set-password');
            } else {
              setError('Falha ao confirmar login. Tente novamente.');
            }
          } catch (err) {
            setError('Erro ao processar o link de login.');
            console.error(err);
          }
        }

        setIsProcessingLink(false);
      }
    };

    checkEmailLink();
  }, [confirmSignIn, navigate, location]);

  // Lidar com o envio do formulário de login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Por favor, insira seu email.');
      return;
    }

    try {
      if (loginMethod === 'link') {
        // Solicitação de link - envia link por email
        const result = await sendLoginLink(email);
        if (result) {
          setSuccess('Link de login enviado para seu email!');
        } else {
          setError('Falha ao enviar o email. Tente novamente.');
        }
      } else {
        // Login com senha
        if (!password) {
          setError('Por favor, insira sua senha.');
          return;
        }

        const result = await loginWithPassword(email, password);
        if (!result) {
          setError('Email ou senha incorretos. Tente novamente.');
        }
        // Se for bem-sucedido, o useEffect vai redirecionar
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
      console.error(err);
    }
  };

  if (isProcessingLink) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Processando...
          </h2>
          <p className="text-center">Estamos verificando seu link de login.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login Admin</h2>
        <p className="text-center mb-6">
          Use após login, peça para um admin liberar suas funcionalidades.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loginMethod === 'password' && (
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 font-medium">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="mb-4 flex justify-between text-sm">
            <label className="flex items-center">
              <input
                type="radio"
                checked={loginMethod === 'password'}
                onChange={() => setLoginMethod('password')}
                className="mr-2"
              />
              Entrar com senha
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={loginMethod === 'link'}
                onChange={() => setLoginMethod('link')}
                className="mr-2"
              />
              Enviar link por email
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
          >
            {loginMethod === 'link' ? 'Enviar Link de Login' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
