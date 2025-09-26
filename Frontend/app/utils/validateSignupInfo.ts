interface UserSignupInfo {
  email: string;
  password: string;
}
export function validateSignupInfo(userSignupInfo:UserSignupInfo, setError: (message: string | null) => void) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userSignupInfo.email)) {
    setError("Invalid email format.");
    return false;
  }

  const password = userSignupInfo.password;

  if (password.length < 8) {
    setError("Password must be at least 8 characters long.");
    return false;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

  if (!hasUppercase) {
    setError("Password must contain at least one uppercase letter.");
    return false;
  }

  if (!hasLowercase) {
    setError("Password must contain at least one lowercase letter.");
    return false;
  }

  if (!hasSpecialChar) {
    setError("Password must contain at least one special character.");
    return false;
  }
  
  setError(null);
  return true;
}