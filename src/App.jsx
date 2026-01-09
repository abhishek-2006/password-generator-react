  import { useState, useRef } from 'react';
  import { Analytics } from '@vercel/analytics/react';

  export default function App() {
    function generatePassword(len, num, char) {
      let passwordChars = [];
      let allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      if (num) {
        const numbers = "0123456789";
        passwordChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
        allChars += numbers;
      }
      if (char) {
        const specialChars = "!@#$%^&*-_+=[]{}~`";
        passwordChars.push(specialChars[Math.floor(Math.random() * specialChars.length)]);
        allChars += specialChars;
      }
      while (passwordChars.length < len) {
        passwordChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
      }
      return passwordChars.sort(() => Math.random() - 0.5).join("");
    }

    const [length, setLength] = useState(12);
    const [numberAllowed, setNumberAllowed] = useState(true);
    const [charAllowed, setCharAllowed] = useState(false);
    const [password, setPassword] = useState(() => generatePassword(12, true, false));
    const [showToast, setShowToast] = useState(false);


    const passwordRef = useRef(null);

    const handleLengthChange = (e) => {
      const newLen = Number(e.target.value);
      setLength(newLen);
      setPassword(generatePassword(newLen, numberAllowed, charAllowed));
    };

    const handleCheckboxChange = (type) => {
      if (type === 'number') {
        const nextVal = !numberAllowed;
        setNumberAllowed(nextVal);
        setPassword(generatePassword(length, nextVal, charAllowed));
      } else {
        const nextVal = !charAllowed;
        setCharAllowed(nextVal);
        setPassword(generatePassword(length, numberAllowed, nextVal));
      }
    };

    const copyToClipboard = () => {
      passwordRef.current?.select();
      window.navigator.clipboard.writeText(password);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    };
    
    const getPasswordStrength = () => {
      let score = 0;

      if (length >= 8) score++;
      if (length >= 12) score++;
      if (numberAllowed) score++;
      if (charAllowed) score++;

      if (score <= 1) return { label: "Weak", color: "bg-orange-400" };
      if (score === 2) return { label: "Good", color: "bg-hero-blue" };
      if (score === 3) return { label: "Strong", color: "bg-indigo-600" };
      return { label: "Very Strong", color: "bg-emerald-500" };
    };

    const strength = getPasswordStrength();

    return (
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-r from-slate-100 via-blue-200 to-indigo-300">
        {/* Dynamic Background Mesh Gradients */}
        <div className="absolute top-[-10%] left-[-10%] h-125 w-[500px] rounded-full bg-hero-blue/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute top-[30%] left-[40%] h-[300px] w-[300px] rounded-full bg-indigo-200/20 blur-[100px]" />

        <div className="z-10 w-full max-w-md px-4">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white/70 p-8 shadow-[0_32px_64px_-16px_rgba(0,82,255,0.15)] backdrop-blur-2xl">
            
            <header className="mb-8 text-center">
              <h1 className="text-3xl font-black text-hero-dark tracking-tight">
                Hero<span className="text-hero-blue">Pass</span>
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-hero-dark/40 mt-1">
                Secure Key Generator
              </p>
            </header>

            {/* Password Display Field */}
            <div className="relative mb-6 group">
              <input
                type="text"
                value={password}
                className="w-full rounded-2xl border-none bg-white px-6 py-5 pr-28 font-mono text-xl font-bold text-hero-dark shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] outline-none ring-1 ring-hero-dark/5 transition-all focus:ring-2 focus:ring-hero-blue"
                readOnly
                ref={passwordRef}
              />
              <button
                onClick={copyToClipboard}
                className={`absolute right-2 top-2 bottom-2 rounded-xl px-6 font-bold text-white transition-all active:scale-95 shadow-lg ${
                  'bg-hero-blue shadow-hero-blue/30 hover:brightness-110'
                }`}
              >
                Copy
              </button>
            </div>

            {/* Strength Indicator */}
            <div className="mb-10 px-1 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-hero-dark/40">
                <span>Password Strength</span>
                <span className="text-hero-dark">
                  {strength.label}
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-hero-dark/5">
                <div
                  className={`h-full transition-all duration-700 ease-out ${strength.color}`}
                  style={{ width: `${Math.min((length / 50) * 100 + (numberAllowed || charAllowed ? 10 : 0), 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-8">
              {/* Slider Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between font-bold text-hero-dark">
                  <span className="text-xs uppercase tracking-widest opacity-40">Length</span>
                  <span className="text-2xl">{length}</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={50}
                  value={length}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-hero-dark/5 accent-hero-blue transition-all"
                  onChange={handleLengthChange}
                />
              </div>

              {/* Pill Toggles */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Include Numbers', state: numberAllowed, type: 'number' },
                  { label: 'Special Symbols', state: charAllowed, type: 'char' }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleCheckboxChange(item.type)}
                    className={`flex items-center justify-between rounded-2xl px-6 py-4 font-bold transition-all active:scale-[0.98] border ${
                      item.state 
                      ? 'border-hero-blue/20 bg-hero-blue/5 text-hero-blue shadow-sm' 
                      : 'border-transparent bg-hero-dark/[0.03] text-hero-dark/40 hover:bg-hero-dark/[0.05]'
                    }`}
                  >
                    <span className="text-sm">{item.label}</span>
                    <div className={`h-6 w-11 rounded-full p-1 transition-colors ${item.state ? 'bg-hero-blue' : 'bg-hero-dark/10'}`}>
                      <div className={`h-4 w-4 rounded-full bg-white transition-transform duration-300 ${item.state ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <footer className="mt-8 flex flex-col items-center gap-4 pt-2">
              <button 
                onClick={() => setPassword(generatePassword(length, numberAllowed, charAllowed))}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-hero-blue transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate Password
              </button>

              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-hero-dark/30">
                Built by{" "}
                <a
                  href="https://github.com/abhishek-2006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors text-hero-blue"
                >
                  Abhishek Shah
                </a>
              </p>
            </footer>
          </div>
        </div>
        {/* Toast */}
        {showToast && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-[toast_0.3s_ease-out] rounded-full bg-hero-dark px-6 py-3 text-sm font-bold text-white shadow-xl">
            Copied to clipboard
          </div>
        )}
        <Analytics />
      </div>
    );
  }