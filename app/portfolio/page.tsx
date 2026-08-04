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
          <div className="pf-photo-frame pf-has-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/portfolio/hero.jpg" alt="Kory Parente" />
          </div>
        </TiltCard>

        <div>
          <h1 className="pf-display pf-name">Kory Parente</h1>
          <div className="pf-badge-row">
            <span className="pf-badge">📍 Chicago Based Creator, IL</span>
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
            <a className="pf-icon-circle" href="mailto:partnerships.itsparente@gmail.com" aria-label="Email">
              @
            </a>
          </div>

          <a className="pf-email-pill" href="mailto:partnerships.itsparente@gmail.com">
            partnerships.itsparente@gmail.com
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
            {/* Real logos — add more of these above the placeholder loop as you get them */}
            <TiltCard maxTilt={14}>
              <div className="pf-logo-box pf-has-image">
                <img src="/portfolio/logo1.png" alt="Brand 1" />
              </div>
            </TiltCard>
            <TiltCard maxTilt={14}>
              <div className="pf-logo-box pf-has-image">
                <img src="/portfolio/logo2.png" alt="Brand 2" />
              </div>
            </TiltCard>

            {Array.from({ length: 6 }).map((_, i) => (
              <TiltCard key={i} maxTilt={14}>
                <div className="pf-logo-box">
                  <span className="pf-plus">+</span>
                  <span>[Logo {i + 3}]</span>
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
            Hi, I&apos;m Kory!
          </h2>
          <p>
            I&apos;m a <mark>Chicago-based</mark> content creator and day trader. I&apos;ve generated 2 million+
            organic views and 3,500+ followers on my personal account, with partnerships varying from bootstrapped
            startups, high-profile UGC programs, and billion-dollar companies.
          </p>
          <p>
            My primary goal is to creatively apply <mark>virality</mark>, <mark>customer conversions</mark>, and{" "}
            <mark>retention</mark> to your brand and product.
          </p>
          <ul className="pf-stat-list">
            <li>
              <strong>2</strong>M+ organic views
            </li>
            <li>
              <strong>3,500</strong>+ followers on my personal account
            </li>
          </ul>
        </div>

        <div className="pf-bio-photo-wrap">
          <TiltCard maxTilt={8}>
            <div className="pf-photo-frame pf-has-image" style={{ aspectRatio: "1" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/portfolio/bio-photo.jpg" alt="Kory Parente" />
            </div>
          </TiltCard>
          <div className="pf-stat-pill">
            <span>[500+] posts</span>
            <span>[3.5]K followers</span>
            <span>[42] following</span>
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

          <a className="pf-email-pill pf-showcase-cta" href="mailto:partnerships.itsparente@gmail.com">
            partnerships.itsparente@gmail.com
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

          <a className="pf-email-pill pf-showcase-cta" href="mailto:partnerships.itsparente@gmail.com">
            partnerships.itsparente@gmail.com
          </a>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="pf-footer pf-bg-cream">
        <h2 className="pf-display">Let&apos;s work together.</h2>
        <a className="pf-email-pill" href="mailto:partnerships.itsparente@gmail.com">
          partnerships.itsparente@gmail.com
        </a>
      </footer>
    </div>
  );
}
