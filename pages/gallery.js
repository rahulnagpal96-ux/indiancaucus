import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import fs from 'fs'
import path from 'path'
import { useState, useCallback } from 'react'

export default function Gallery({ images }) {
  const [lightbox, setLightbox] = useState({ open: false, idx: 0 })

  const prev = useCallback(() => {
    setLightbox((lb) => ({ ...lb, idx: (lb.idx - 1 + images.length) % images.length }))
  }, [images.length])

  const next = useCallback(() => {
    setLightbox((lb) => ({ ...lb, idx: (lb.idx + 1) % images.length }))
  }, [images.length])

  return (
    <div className="min-h-screen">
      <Head>
        <title>Gallery — Indian Caucus of Secaucus</title>
        <meta name="description" content="Photos from Indian Caucus events — Holi, Garba & Dandiya, and Diwali Mela in Secaucus, NJ." />
      </Head>
      <Header />

      {/* Hero */}
      <section className="hero-bg dot-pattern">
        <div className="container-max px-4 md:px-6 py-16 md:py-20">
          <span className="section-label" style={{background:'rgba(242,102,68,0.2)', color:'#FF9933'}}>Photo Gallery</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-3 leading-tight">
            Memories from our festivals.
          </h1>
          <p className="mt-4 text-gray-300 max-w-xl text-lg">
            A glimpse of the joy, color, and community that make our events unforgettable.
          </p>
        </div>
      </section>

      <main className="container-max px-4 md:px-6 mt-12">
        {images.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-5">📸</div>
            <h2 className="text-2xl font-bold text-gray-900">Photos coming soon</h2>
            <p className="text-gray-500 mt-3 max-w-md mx-auto">
              We're adding event photos — check back soon. In the meantime, see our past events on Facebook.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {process.env.NEXT_PUBLIC_FACEBOOK && (
                <a href={process.env.NEXT_PUBLIC_FACEBOOK} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm px-6 py-3">
                  Facebook Albums →
                </a>
              )}
              <Link href="/events" className="btn-secondary text-sm px-6 py-3">See Our Events</Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">{images.length} photo{images.length !== 1 ? 's' : ''} — click to enlarge</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setLightbox({ open: true, idx: i })}
                  className="block overflow-hidden rounded-xl aspect-square focus:outline-none focus:ring-2 focus:ring-brand-orange card-hover"
                  aria-label={`Open photo ${i + 1}`}
                >
                  <img
                    src={img}
                    alt={`Event photo ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </>
        )}

        {/* Facebook CTA */}
        {images.length > 0 && (
          <div className="mt-12 mb-8 rounded-2xl bg-gray-50 border border-gray-100 p-8 text-center">
            <div className="text-3xl mb-3">📷</div>
            <h3 className="font-bold text-gray-900 text-lg">More photos on Facebook</h3>
            <p className="text-gray-500 text-sm mt-2">See full albums from all our past events on our Facebook page.</p>
            {process.env.NEXT_PUBLIC_FACEBOOK && (
              <a href={process.env.NEXT_PUBLIC_FACEBOOK} target="_blank" rel="noopener noreferrer" className="mt-5 btn-primary text-sm px-6 py-3 inline-block">
                View Facebook Albums →
              </a>
            )}
          </div>
        )}
      </main>

      {/* Lightbox */}
      {lightbox.open && images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setLightbox({ open: false, idx: 0 })}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          <div className="max-w-5xl max-h-[88vh] px-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightbox.idx]}
              alt={`Photo ${lightbox.idx + 1}`}
              className="max-w-full max-h-[88vh] object-contain rounded-xl"
            />
            <p className="text-center text-gray-400 text-sm mt-3">{lightbox.idx + 1} / {images.length}</p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>

          <button
            onClick={() => setLightbox({ open: false, idx: 0 })}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
      )}

      <Footer />
    </div>
  )
}

export async function getStaticProps() {
  const galleryDir = path.join(process.cwd(), 'public', 'gallery')
  let images = []
  try {
    const files = fs.readdirSync(galleryDir)
    images = files
      .filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f))
      .map((f) => `/gallery/${f}`)
  } catch {
    images = []
  }
  return { props: { images } }
}
