export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
          StrataSnap
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 mb-12 font-light">
          AI-powered strata report analysis. Coming soon.
        </p>
        <div className="inline-block bg-white rounded-2xl shadow-sm px-8 py-6 border border-slate-200">
          <p className="text-sm text-slate-500 mb-2">Get in touch</p>
          <a
          
            href="mailto:hello@stratasnap.com.au"
            className="text-lg font-medium text-slate-900 hover:text-blue-600 transition-colors"
          >
            hello@stratasnap.com.au
          </a>
        </div>
      </div>
    </main>
  );
}
