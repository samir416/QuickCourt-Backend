const fs = require('fs');
const file = 'src/pages/LogSign.jsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useRef')) {
    content = content.replace('import { useState } from "react";', 'import { useState, useRef } from "react";');
}

if (!content.includes('otpRefs')) {
    content = content.replace('const [code, setCode] = useState(["", "", "", "", "", ""]);', 'const [code, setCode] = useState(["", "", "", "", "", ""]);\n  const otpRefs = useRef([]);');
}

const enhanced = 
                  <div className="code-inputs" style={{marginBottom:'20px'}}>
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        maxLength="1"
                        inputMode="numeric"
                        value={digit}
                        ref={(el) => (otpRefs.current[index] = el)}
                        autoFocus={index === 0}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedData = e.clipboardData.getData('text/plain').slice(0, 6).split('');
                          if (pastedData.length > 0) {
                            const newCode = [...code];
                            pastedData.forEach((d, i) => {
                              if (i < 6 && /[0-9]/.test(d)) newCode[i] = d;
                            });
                            setCode(newCode);
                            const nextIndex = Math.min(pastedData.length, 5);
                            otpRefs.current[nextIndex]?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace') {
                            e.preventDefault();
                            const newCode = [...code];
                            if (code[index]) {
                              newCode[index] = "";
                              setCode(newCode);
                            } else if (index > 0) {
                              newCode[index - 1] = "";
                              setCode(newCode);
                              otpRefs.current[index - 1]?.focus();
                            }
                          }
                        }}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val) {
                            const newCode = [...code];
                            newCode[index] = val;
                            setCode(newCode);
                            if (index < 5) otpRefs.current[index + 1]?.focus();
                          }
                        }}
                      />
                    ))}
;

const regex = /<div className="code-inputs"[\s\S]*?setCode\(newCode\);\s*}\s*}\s*\/>\s*\)\)\s*}/;
content = content.replace(regex, enhanced.trim());
fs.writeFileSync(file, content);
