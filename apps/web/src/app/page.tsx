import Link from 'next/link';
import { getSiteData, getPosts } from '@/lib/api';
import { AssetImg } from '@/components/AssetImg';
import { PostCard } from '@/components/PostCard';
import { VideoSection } from '@/components/VideoSection';

export default async function HomePage() {
  const { site, assets } = await getSiteData();
  const a = assets as Record<string, string>;
  const latestBlog = (await getPosts('blog')).slice(0, 3);
  const latestNews = (await getPosts('news')).slice(0, 3);

  return (
    <div className="page-home">
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-shapes" aria-hidden="true">
          <span className="shape shape-1" />
          <span className="shape shape-2" />
          <span className="shape shape-3" />
        </div>
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">
              <a href={site.companyUrl} target="_blank" rel="noopener noreferrer">
                {site.company}
              </a>
            </p>
            <h1>
              Find your inner peace with <em>compassionate</em> psychotherapy
            </h1>
            <p className="lead">
              Welcome to nayab.life — insights, articles, and developments in psychotherapy from{' '}
              <strong>{site.owner}</strong>, Registered Psychotherapist in Ontario.
            </p>
            <div className="hero-actions">
              <a href={site.janeApp} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                Book a consultation
              </a>
              <Link href="/about" className="btn btn-glass">
                Meet Nayab
              </Link>
              <a href="#videos" className="btn btn-outline">
                Watch videos
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <strong>MACP</strong>
                <span>Counselling Psychology</span>
              </div>
              <div>
                <strong>5+</strong>
                <span>Countries lived</span>
              </div>
              <div>
                <strong>IFS</strong>
                <span>Certified approaches</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="portrait-frame">
              <AssetImg
                src={a.nayabIntroBanner}
                fallback={a.heroPortraitFallback}
                alt="Nayab Tahir, Registered Psychotherapist"
                className="hero-portrait"
                loading="eager"
              />
            </div>
            <div className="hero-badge">
              <span>IFS · CBT · DBT</span>
              <span>Trauma-informed care</span>
            </div>
          </div>
        </div>
      </section>

      <section className="visual-strip pillars-section" aria-label="Therapeutic focus areas">
        <div className="container">
          <div className="visual-strip-track pillars-grid">
            {[
              {
                src: a.therapySession,
                fb: a.therapySessionFallback,
                cap: 'Collaborative Therapy',
                label: 'Together in care',
                desc: 'A client-led space where your voice, pace, and goals shape every session.',
                theme: 'sage',
              },
              {
                src: a.mindfulness,
                fb: a.mindfulnessFallback,
                cap: 'Mindfulness Balance',
                label: 'Calm & grounded',
                desc: 'Nervous-system-focused practices that restore clarity, presence, and inner steadiness.',
                theme: 'lavender',
              },
              {
                src: a.calmNature,
                fb: a.calmNatureFallback,
                cap: 'Emotional Wellness',
                label: 'Heal & grow',
                desc: 'Compassionate support to understand emotions, build resilience, and feel whole again.',
                theme: 'peach',
              },
            ].map((item) => (
              <figure key={item.cap} className={`pillar-card pillar-card--${item.theme}`}>
                <AssetImg src={item.src} fallback={item.fb} alt={item.cap} className="strip-img" />
                <figcaption className="pillar-overlay">
                  <span className="pillar-label">{item.label}</span>
                  <strong className="pillar-caption">{item.cap}</strong>
                  <p className="pillar-desc">{item.desc}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <VideoSection assets={a} showCta />

      <section className="section intro-strip">
        <div className="container intro-grid">
          <blockquote>
            Therapy is not about quick fixes — it is a collaborative process focused on self-awareness,
            coping skills, and long-term emotional well-being.
          </blockquote>
          <div>
            <p>
              Through <a href={site.companyUrl}>{site.company.replace(' Inc.', '')}</a>, Nayab offers
              evidence-based, trauma-informed psychotherapy for adults navigating anxiety, trauma, relationship
              challenges, and life transitions.
            </p>
            <Link href="/approach" className="btn btn-outline">
              Explore my approach
            </Link>
          </div>
        </div>
      </section>

      {latestBlog.length > 0 && (
        <section className="section alt">
          <div className="container">
            <header className="section-header">
              <h2>From the blog</h2>
              <Link href="/blog" className="btn btn-text">
                All posts
              </Link>
            </header>
            <div className="card-grid three">
              {latestBlog.map((post) => (
                <PostCard key={post.slug} post={post} type="blog" />
              ))}
            </div>
          </div>
        </section>
      )}

      {latestNews.length > 0 && (
        <section className="section">
          <div className="container">
            <header className="section-header">
              <h2>News &amp; developments</h2>
              <Link href="/news" className="btn btn-text">
                All news
              </Link>
            </header>
            <div className="card-grid three">
              {latestNews.map((post) => (
                <PostCard key={post.slug} post={post} type="news" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section cta-band">
        <div className="cta-band-bg" aria-hidden="true" />
        <div className="container cta-inner">
          <div>
            <h2>Ready to take the next step?</h2>
            <p>Book a free consultation or explore therapeutic approaches that honour your pace and goals.</p>
          </div>
          <div className="cta-actions">
            <a href={site.janeApp} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Jane App
            </a>
            <Link href="/contact" className="btn btn-glass">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
