import { useState, useEffect, useRef, useCallback } from "react";

/* ─── scroll-triggered visibility hook ─── */
function useReveal(threshold = 0.18) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── reusable reveal wrapper ─── */
function Reveal({ children, delay = 0, direction = "up", style = {} }) {
  const [ref, vis] = useReveal(0.15);
  const transforms = {
    up: "translateY(50px)",
    down: "translateY(-50px)",
    left: "translateX(60px)",
    right: "translateX(-60px)",
    none: "none",
  };
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : transforms[direction],
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── animated counter ─── */
function Counter({ end, suffix = "", duration = 2000 }) {
  const [ref, vis] = useReveal(0.3);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!vis) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [vis, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── progress dots nav ─── */
function ProgressNav({ sections, active }) {
  return (
    <div style={{
      position: "fixed", right: 28, top: "50%", transform: "translateY(-50%)",
      display: "flex", flexDirection: "column", gap: 14, zIndex: 100,
    }}>
      {sections.map((s, i) => (
        <a
          key={i}
          href={`#s${i}`}
          title={s}
          style={{
            width: 10, height: 10, borderRadius: "50%",
            background: i === active ? "#3b82f6" : "rgba(255,255,255,0.15)",
            border: i === active ? "2px solid #3b82f6" : "2px solid rgba(255,255,255,0.1)",
            transition: "all 0.3s",
            display: "block",
          }}
        />
      ))}
    </div>
  );
}

/* ─── MAIN ─── */
export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionNames = ["The Problem", "The Concept", "How It Works", "What It Catches", "Let's Talk"];

  /* track active section */
  useEffect(() => {
    const handler = () => {
      const mid = window.innerHeight / 2;
      for (let i = sectionNames.length - 1; i >= 0; i--) {
        const el = document.getElementById(`s${i}`);
        if (el && el.getBoundingClientRect().top < mid) { setActiveSection(i); break; }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{
      background: "#060a14",
      color: "#e4e9f2",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      minHeight: "100vh",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        body { background: #060a14; }
        a { color: inherit; text-decoration: none; }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.15); }
          50% { box-shadow: 0 0 40px rgba(59,130,246,0.3); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes scan-line {
          0% { top: 0; opacity: 1; }
          50% { opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(6,10,20,0.88)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", color: "#6b7fa3" }}>
          Soteris <span style={{ color: "#3b82f6" }}>// Data Readiness</span>
        </div>
        <div style={{ fontSize: 13, color: "#5a6b85" }}>Bharat Gurbaxani</div>
      </nav>

      <ProgressNav sections={sectionNames} active={activeSection} />

      {/* ═══════════ SECTION 1: THE PROBLEM ═══════════ */}
      <section id="s0" style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "120px 48px 80px",
        position: "relative",
      }}>
        {/* bg gradient orb */}
        <div style={{
          position: "absolute", top: "20%", left: "-10%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 900, position: "relative" }}>
          <Reveal delay={0.1}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 3,
              textTransform: "uppercase", color: "#3b82f6", marginBottom: 28,
            }}>
              The onboarding bottleneck
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif", fontSize: "clamp(38px, 5.5vw, 68px)",
              fontWeight: 400, lineHeight: 1.1, marginBottom: 40, maxWidth: 780,
            }}>
              Every new carrier stalls on{" "}
              <span style={{
                color: "#ef4444",
                textDecoration: "underline",
                textDecorationColor: "rgba(239,68,68,0.3)",
                textUnderlineOffset: 6,
              }}>data</span>.
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <div style={{
              display: "inline-flex", alignItems: "baseline", gap: 20,
              background: "rgba(17,24,39,0.7)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "24px 36px", marginBottom: 36,
            }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 60, color: "#ef4444", lineHeight: 1 }}>
                <Counter end={6} suffix="" />
              </span>
              <span style={{ fontSize: 16, color: "#7a8ba8", maxWidth: 300, lineHeight: 1.55 }}>
                months of back-and-forth before engineering can begin model training.
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.55}>
            <p style={{ fontSize: 17, color: "#7a8ba8", maxWidth: 580, lineHeight: 1.75 }}>
              Missing fields. Wrong formats. Broken joins. Not enough history.
              The data conversation happens at <strong style={{ color: "#e4e9f2", fontWeight: 600 }}>month 3</strong>,
              when it should happen at <strong style={{ color: "#3b82f6", fontWeight: 600 }}>week 0</strong>.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ SECTION 2: THE CONCEPT ═══════════ */}
      <section id="s1" style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "80px 48px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 800 }}>
          <Reveal>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 3,
              textTransform: "uppercase", color: "#3b82f6", marginBottom: 24,
            }}>
              The concept
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 400, lineHeight: 1.15, marginBottom: 48,
            }}>
              Validate carrier data<br />
              <span style={{ color: "#22c55e" }}>before</span> onboarding kicks off.
            </h2>
          </Reveal>

          {/* the flow diagram */}
          <Reveal delay={0.3}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 0, flexWrap: "wrap", margin: "0 auto",
            }}>
              {[
                { label: "Carrier Data", sub: "Policy + Claims CSVs", color: "#eab308", icon: "📄" },
                { label: "arrow" },
                { label: "Readiness Checker", sub: "6 validation layers", color: "#3b82f6", icon: "⚡", glow: true },
                { label: "arrow" },
                { label: "Gap Report", sub: "Score + action items", color: "#22c55e", icon: "✓" },
              ].map((item, i) =>
                item.label === "arrow" ? (
                  <Reveal key={i} delay={0.35 + i * 0.08} direction="left">
                    <div style={{
                      width: 48, height: 2,
                      background: "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
                      margin: "0 4px",
                    }} />
                  </Reveal>
                ) : (
                  <Reveal key={i} delay={0.35 + i * 0.08} direction="up">
                    <div style={{
                      width: 180, padding: "28px 20px",
                      background: "rgba(17,24,39,0.6)",
                      border: `1px solid ${item.glow ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: 16,
                      animation: item.glow ? "pulse-glow 3s ease-in-out infinite" : "none",
                    }}>
                      <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: item.color, marginBottom: 6 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: "#5a6b85" }}>{item.sub}</div>
                    </div>
                  </Reveal>
                )
              )}
            </div>
          </Reveal>

          <Reveal delay={0.6}>
            <p style={{ fontSize: 15, color: "#5a6b85", marginTop: 40, maxWidth: 500, margin: "40px auto 0" }}>
              60-day onboarding starts with a 60-minute assessment.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ SECTION 3: HOW IT WORKS ═══════════ */}
      <section id="s2" style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "80px 48px",
      }}>
        <div style={{ maxWidth: 1050, width: "100%", margin: "0 auto" }}>
          <Reveal>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 3,
              textTransform: "uppercase", color: "#3b82f6", marginBottom: 20,
            }}>
              How it works
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 400, lineHeight: 1.2, marginBottom: 48,
            }}>
              Three steps. One session.
            </h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              {
                step: "01",
                title: "Configure",
                desc: "Pre-loaded with personal auto rating factors your ML model actually consumes. Driver age, credit tier, vehicle make/model, coverage limits, territory. SE adds carrier-specific fields on top.",
                color: "#eab308",
              },
              {
                step: "02",
                title: "Upload",
                desc: "Carrier drops their sample policy and claims CSVs. Tool normalizes column names, surfaces unmapped columns for manual assignment. Handles the 'they call it GWP, we call it written_premium' problem.",
                color: "#3b82f6",
              },
              {
                step: "03",
                title: "Assess",
                desc: "Readiness score (0-100), traffic light, and a gap report the carrier's data team can act on without calling engineering. Downloadable scoping doc pre-filled from the analysis.",
                color: "#22c55e",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={0.2 + i * 0.12} direction="up">
                <div style={{
                  background: "rgba(17,24,39,0.5)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16, padding: "36px 28px",
                  height: "100%",
                  position: "relative", overflow: "hidden",
                }}>
                  {/* top accent line */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: item.color,
                    opacity: 0.6,
                  }} />
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                    color: item.color, letterSpacing: 2, marginBottom: 16,
                  }}>
                    STEP {item.step}
                  </div>
                  <div style={{
                    fontFamily: "'DM Serif Display', serif", fontSize: 24,
                    marginBottom: 16, fontWeight: 400,
                  }}>
                    {item.title}
                  </div>
                  <p style={{ fontSize: 14, color: "#7a8ba8", lineHeight: 1.7 }}>
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 4: WHAT IT CATCHES ═══════════ */}
      <section id="s3" style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "80px 48px",
        position: "relative",
      }}>
        {/* bg gradient orb */}
        <div style={{
          position: "absolute", bottom: "10%", right: "-5%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1050, width: "100%", margin: "0 auto", position: "relative" }}>
          <Reveal>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 3,
              textTransform: "uppercase", color: "#3b82f6", marginBottom: 20,
            }}>
              Six validation layers
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 400, lineHeight: 1.2, marginBottom: 16,
            }}>
              Not a CSV linter.
            </h2>
          </Reveal>

          <Reveal delay={0.18}>
            <p style={{ fontSize: 15, color: "#5a6b85", marginBottom: 44, maxWidth: 550 }}>
              Layer 6 catches what only someone who understands insurance data would catch.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {[
              { n: "01", title: "Schema Completeness", desc: "Rating factors present? Fields classified critical / important / nice-to-have.", tag: "STRUCTURAL" },
              { n: "02", title: "Format Consistency", desc: "Mixed date formats? Premium in cents vs dollars? State code mismatches?", tag: "STRUCTURAL" },
              { n: "03", title: "Referential Integrity", desc: "Every claim links to a real policy? Loss dates within policy terms?", tag: "RELATIONAL" },
              { n: "04", title: "Historical Depth", desc: "Enough years for model training? Gap months? Continuous coverage?", tag: "ADEQUACY" },
              { n: "05", title: "Data Quality", desc: "Null rates, duplicates, outliers, PII flags.", tag: "QUALITY" },
              { n: "06", title: "Insurance Domain Logic", desc: "Zero-premium policies. Claims exceeding limits. Duplicate VINs. Claim frequency sanity.", tag: "DOMAIN", highlight: true },
            ].map((item, i) => (
              <Reveal key={i} delay={0.2 + i * 0.08} direction="up">
                <div style={{
                  display: "flex", gap: 16, alignItems: "flex-start",
                  padding: "20px 22px",
                  background: item.highlight ? "rgba(34,197,94,0.04)" : "rgba(17,24,39,0.35)",
                  border: item.highlight ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(255,255,255,0.04)",
                  borderRadius: 12,
                }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                    color: item.highlight ? "#22c55e" : "#3b5678",
                    minWidth: 24, paddingTop: 2,
                  }}>
                    {item.n}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 15, fontWeight: 600, marginBottom: 4,
                      color: item.highlight ? "#22c55e" : "#e4e9f2",
                    }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 13, color: "#6b7fa3", lineHeight: 1.6 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 5: CTA ═══════════ */}
      <section id="s4" style={{
        minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "80px 48px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 600 }}>
          <Reveal>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 3,
              textTransform: "uppercase", color: "#3b82f6", marginBottom: 28,
            }}>
              Next step
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif", fontSize: "clamp(30px, 4vw, 48px)",
              fontWeight: 400, lineHeight: 1.15, marginBottom: 24,
            }}>
              Built to show how I'd<br />approach the problem.
            </h2>
          </Reveal>

          <Reveal delay={0.25}>
            <p style={{ fontSize: 15, color: "#6b7fa3", lineHeight: 1.7, marginBottom: 40 }}>
              This is a v0.1 grounded in ACORD personal auto standards.
              The schema is configurable, the validation logic ports to your actual data model,
              and the gap report is something a carrier's data team can act on day one.
            </p>
          </Reveal>

          <Reveal delay={0.38}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="mailto:bharatgurbaxani@gmail.com"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 32px",
                  background: "#2563eb", color: "#fff",
                  borderRadius: 10, fontSize: 14, fontWeight: 600,
                  transition: "background 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}
              >
                Let's talk
              </a>
              <a
                href="#"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 32px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#e4e9f2",
                  borderRadius: 10, fontSize: 14, fontWeight: 500,
                  transition: "border-color 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
              >
                View tool demo ↗
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "32px 48px",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: 12, color: "#3b5678",
      }}>
        <span>Bharat Gurbaxani // Solutions Engineer</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>April 2026</span>
      </footer>
    </div>
  );
}
