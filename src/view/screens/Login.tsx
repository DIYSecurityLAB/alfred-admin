import { auth } from '@/configs/firebase';
import { useAuth } from '@/hooks/useAuth';
import { isSignInWithEmailLink } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessingLink, setIsProcessingLink] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'link'>(
    'password',
  );

  const {
    sendLoginLink,
    confirmSignIn,
    currentUser,
    loginWithPassword,
    checkUserExists,
    registerWithPassword, // Presume-se que este método foi adicionado ao hook useAuth
  } = useAuth();

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

        if (isRegister) {
          // Verificar se o email já existe
          const userExists = await checkUserExists(email);
          if (userExists) {
            setError(
              'Este email já está cadastrado. Faça login ou use outro email.',
            );
            return;
          }

          // Registro direto com email e senha
          const result = await registerWithPassword(email, password);
          if (result) {
            setSuccess('Conta criada com sucesso! Você será redirecionado...');
            setTimeout(() => {
              navigate('/');
            }, 2000);
          } else {
            setError('Falha ao criar a conta. Tente novamente.');
          }
        } else {
          // Tentativa de login
          const result = await loginWithPassword(email, password);
          if (!result) {
            setError('Email ou senha incorretos. Tente novamente.');
          }
          // Se for bem-sucedido, o useEffect vai redirecionar
        }
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro durante a autenticação. Tente novamente.');
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        {/* Tab de seleção entre Login e Registro */}
        <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 px-4 text-center rounded-md transition-all ${
              !isRegister
                ? 'bg-white shadow-sm text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 px-4 text-center rounded-md transition-all ${
              isRegister
                ? 'bg-white shadow-sm text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Primeiro Acesso
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-center">
          {isRegister ? 'Criar Conta' : 'Login Admin'}
        </h2>
        <p className="text-center mb-6 text-gray-600 text-sm">
          {isRegister
            ? 'Registre-se para acessar o painel administrativo.'
            : 'Use após login, peça para um admin liberar suas funcionalidades.'}
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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* Opção de método de login - somente visível na tela de login, não no registro */}
          {!isRegister && (
            <div className="mb-6">
              <label className="block mb-2 font-medium">Método de acesso</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`flex-1 py-2 px-4 text-sm text-center rounded-md transition-all ${
                    loginMethod === 'password'
                      ? 'bg-white shadow-sm text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Usar senha
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('link')}
                  className={`flex-1 py-2 px-4 text-sm text-center rounded-md transition-all ${
                    loginMethod === 'link'
                      ? 'bg-white shadow-sm text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Link por email
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium mt-2"
          >
            {loginMethod === 'link'
              ? 'Enviar Link de Login'
              : isRegister
                ? 'Criar Conta'
                : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
