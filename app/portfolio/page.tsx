import "./portfolio.css";
import TiltCard from "@/components/portfolio/TiltCard";
import WaveDivider from "@/components/portfolio/WaveDivider";

export const metadata = { title: "Portfolio" };

/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT ME: everything in brackets [ ] below is a placeholder.
 *  Swap in your real name, numbers, links, and video URLs.
 *  The colored section backgrounds are set with the pf-bg-*
 *  classes further down if you want to reorder/recolor them.
 * ─────────────────────────────────────────────────────────────
 */

export default function PortfolioPage() {
  return (
    <div className="pf-root">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="pf-section pf-bg-cream pf-hero pf-inner">
        <TiltCard maxTilt={8}>
          <div className="pf-photo-frame">
            <span className="pf-hint">
              [Add your photo here]
              <br />
              4:5 portrait works best
            </span>
          </div>
        </TiltCard>

        <div>
          <h1 className="pf-display pf-name">[Your Name]</h1>
          <div className="pf-badge-row">
            <span className="pf-badge">📍 [City] Based Creator</span>
          </div>
          <p className="pf-tagline">[Your niche — e.g. Tech + Lifestyle Creator]</p>

          <div className="pf-social-row">
            <a className="pf-icon-circle" href="[your Instagram URL]" aria-label="Instagram">
              IG
            </a>
            <a className="pf-icon-circle" href="[your TikTok URL]" aria-label="TikTok">
              TT
            </a>
            <a className="pf-icon-circle" href="[your YouTube URL]" aria-label="YouTube">
              YT
            </a>
            <a className="pf-icon-circle" href="mailto:[you@example.com]" aria-label="Email">
              @
            </a>
          </div>

          <a className="pf-email-pill" href="mailto:[you@example.com]">
            [you@example.com]
          </a>
        </div>
      </section>

      <WaveDivider fill="var(--pf-sun)" />

      {/* ── NOTABLE PARTNERSHIPS ─────────────────────────── */}
      <section className="pf-section pf-bg-sun">
        <div className="pf-inner">
          <div className="pf-eyebrow">Who I&apos;ve worked with</div>
          <h2 className="pf-display pf-heading">Notable Partnerships</h2>
          <div className="pf-logo-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <TiltCard key={i} maxTilt={14}>
                <div className="pf-logo-box">
                  <span className="pf-plus">+</span>
                  <span>[Logo {i + 1}]</span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider fill="var(--pf-cream)" />

      {/* ── BIO ──────────────────────────────────────────── */}
      <section className="pf-section pf-bg-cream pf-bio pf-inner">
        <div className="pf-bio-body">
          <h2 className="pf-display" style={{ fontSize: "clamp(28px,4vw,42px)", marginBottom: 18 }}>
            Hi, I&apos;m [Name]!
          </h2>
          <p>
            [A couple sentences about who you are, where you&apos;re based, and what kind of content you make.
            e.g. I&apos;m a <mark>[city]-based</mark> creator making <mark>[niche]</mark> content.]
          </p>
          <p>
            [What you&apos;ve done — brand types you&apos;ve worked with, your specialty, what makes your content
            perform.]
          </p>
          <ul className="pf-stat-list">
            <li>
              <strong>[00]M+</strong> organic views
            </li>
            <li>
              <strong>[00]K+</strong> followers across accounts
            </li>
          </ul>
        </div>

        <div className="pf-bio-photo-wrap">
          <TiltCard maxTilt={8}>
            <div className="pf-photo-frame" style={{ aspectRatio: "1" }}>
              <span className="pf-hint">[Second photo]</span>
            </div>
          </TiltCard>
          <div className="pf-stat-pill">
            <span>[000] posts</span>
            <span>[00]K followers</span>
            <span>[0,000] following</span>
          </div>
        </div>
      </section>

      <WaveDivider fill="var(--pf-punch)" />

      {/* ── SHOWCASE 1 (duplicate this whole <section> block for more) ── */}
      <section className="pf-section pf-bg-punch">
        <div className="pf-inner">
          <div className="pf-eyebrow pf-mono">[00]M+ Views</div>
          <h2 className="pf-display pf-heading">Personal Brand</h2>

          <div className="pf-showcase">
            <TiltCard maxTilt={6}>
              <div className="pf-profile-card">
                <div className="pf-avatar" />
                <div className="pf-handle">@[yourhandle]</div>
                <div className="pf-profile-stats">
                  <span>[000] posts</span>
                  <span>[00]K followers</span>
                  <span>[0,000] following</span>
                </div>
                <div className="pf-bio-line">[Short profile bio line, matches your real Instagram/TikTok bio]</div>
              </div>
            </TiltCard>

            <div className="pf-video-row">
              {[1, 2, 3].map((n) => (
                <TiltCard key={n} maxTilt={12}>
                  <div className="pf-video-card">
                    <div style={{ position: "relative" }}>
                      <span className="pf-view-badge">[0.0]M views</span>
                      <div className="pf-video-thumb">
                        <div className="pf-play">▶</div>
                      </div>
                    </div>
                    <div className="pf-video-meta">
                      [Video {n} caption]
                      <br />
                      <a className="pf-video-cta" href="[link to post]">
                        View on Instagram →
                      </a>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>

          <a className="pf-email-pill pf-showcase-cta" href="mailto:[you@example.com]">
            [you@example.com]
          </a>
        </div>
      </section>

      <WaveDivider fill="var(--pf-grass)" />

      {/* ── SHOWCASE 2 — copy of the block above for a second brand/campaign ── */}
      <section className="pf-section pf-bg-grass">
        <div className="pf-inner">
          <div className="pf-eyebrow pf-mono">[00]M+ Views</div>
          <h2 className="pf-display pf-heading">[Brand or Campaign Name]</h2>

          <div className="pf-showcase">
            <TiltCard maxTilt={6}>
              <div className="pf-profile-card">
                <div className="pf-avatar" />
                <div className="pf-handle">@[handle]</div>
                <div className="pf-profile-stats">
                  <span>[000] posts</span>
                  <span>[0]K followers</span>
                  <span>[00] following</span>
                </div>
                <div className="pf-bio-line">[Bio line for this account]</div>
              </div>
            </TiltCard>

            <div className="pf-video-row">
              {[1, 2, 3].map((n) => (
                <TiltCard key={n} maxTilt={12}>
                  <div className="pf-video-card">
                    <div style={{ position: "relative" }}>
                      <span className="pf-view-badge">[000]K views</span>
                      <div className="pf-video-thumb">
                        <div className="pf-play">▶</div>
                      </div>
                    </div>
                    <div className="pf-video-meta">
                      [Video {n} caption]
                      <br />
                      <a className="pf-video-cta" href="[link to post]">
                        View on Instagram →
                      </a>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>

          <a className="pf-email-pill pf-showcase-cta" href="mailto:[you@example.com]">
            [you@example.com]
          </a>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="pf-footer pf-bg-cream">
        <h2 className="pf-display">Let&apos;s work together.</h2>
        <a className="pf-email-pill" href="mailto:[you@example.com]">
          [you@example.com]
        </a>
      </footer>
    </div>
  );
}
