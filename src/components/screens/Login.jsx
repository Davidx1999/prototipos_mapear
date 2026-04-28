
import React from 'react';
import { Contrast, Eye, EyeOff } from 'lucide-react';
import LogoFgv from '../ui/LogoFgv';
import Button from '../ui/Button';

const Login = ({
  colors,
  isHighContrast,
  setIsHighContrast,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loginError,
  handleLogin,
  setIsLoggedIn,
  setCurrentScreen
}) => {
  return (
    <div className="min-h-screen w-full flex p-[16px] md:p-[24px]" style={{ backgroundColor: isHighContrast ? '#000000' : colors.neutral[0], fontFamily: 'Montserrat, sans-serif' }}>
      <div className="w-full relative flex items-center justify-center rounded-[8px] overflow-hidden transition-all duration-500" style={{ backgroundColor: isHighContrast ? '#000000' : colors.primary.base, border: isHighContrast ? '2px solid #FACC15' : 'none', backgroundImage: isHighContrast ? 'none' : 'url("https://images.unsplash.com/photo-1619252584172-a83a949b6efd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'multiply' }}>
        <div className="relative z-10 p-[32px] md:p-[48px] rounded-[8px] w-full max-w-[420px] shadow-2xl flex flex-col items-center transition-colors duration-500 m-[16px]" style={{ backgroundColor: colors.neutral[0], border: isHighContrast ? '1px solid #FFFFFF' : 'none' }}>
          <div className="absolute top-[16px] right-[16px] flex gap-[8px]">
            <div className="p-[8px] rounded-[8px] cursor-pointer transition-colors border" style={{ backgroundColor: colors.neutral[0], borderColor: colors.neutral[2], color: colors.neutral[7] }} onClick={() => setIsHighContrast(!isHighContrast)} title="Alto Contraste"><Contrast size={18} /></div>
          </div>

          {/* Logo Login Específica */}
          <div className="mb-[32px]">
            <img src={`${import.meta.env.BASE_URL}assets/logo_login_mapear.png`} alt="Mapear Login" className="h-[40px] md:h-[72px] object-contain" />
          </div>

          <div className="text-center w-full">
            <h1 className="text-[20px] md:text-[24px] font-bold" style={{ color: colors.neutral[7] }}>Olá, boas-vindas!</h1>
            <p className="text-[13px] md:text-[14px] mt-[8px]" style={{ color: isHighContrast ? '#FFFFFF' : colors.neutral[5] }}>Por favor, realize seu login ou solicite cadastro</p>
          </div>
          <form className="w-full mt-[32px] flex flex-col gap-[16px]" onSubmit={handleLogin}>
            <div className="flex flex-col gap-[4px]">
              <label className="text-[12px] font-semibold" style={{ color: colors.neutral[7] }}>Nome de Usuário</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Seu login" className="w-full px-[16px] py-[12px] rounded-[8px] border text-[14px] outline-none transition-colors focus:border-[#008BC9]" style={{ borderColor: loginError ? '#EF4444' : colors.neutral[3], color: colors.neutral[7], backgroundColor: colors.neutral[0] }} />
            </div>
            <div className="flex flex-col gap-[4px] relative">
              <label className="text-[12px] font-semibold" style={{ color: colors.neutral[7] }}>Senha</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" className="w-full px-[16px] py-[12px] rounded-[8px] border text-[14px] outline-none transition-colors focus:border-[#008BC9]" style={{ borderColor: loginError ? '#EF4444' : colors.neutral[3], color: colors.neutral[7], backgroundColor: colors.neutral[0] }} />
                <div className="absolute right-[16px] top-[12px] cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye size={18} style={{ color: colors.neutral[5] }} /> : <EyeOff size={18} style={{ color: colors.neutral[5] }} />}
                </div>
              </div>
            </div>
            {loginError && <span className="text-red-500 text-[12px] font-semibold">{loginError}</span>}
            <Button variant="primary" type="submit" className="w-full mt-[8px]">Login</Button>
            <Button variant="tertiary" type="button" className="w-full" onClick={() => { setIsLoggedIn(true); setCurrentScreen('dashboard'); }}>Acessar Plataforma</Button>
          </form>
          <p className="text-[10px] mt-[48px]" style={{ color: isHighContrast ? '#FFFFFF' : colors.neutral[4] }}>Todos os direitos reservados © 2026 FGV DGPE</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
