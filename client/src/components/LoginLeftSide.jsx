const LoginLeftSide = () => {
  return (
   <div className="hidden md:flex w-1/2 bg-indigo-950 relative overflow-hidden border-r border-slate-200">

  {/* BACKGROUND GLOW */}
  <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

  <div className="absolute bottom-[-120px] right-[-80px] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

  {/* GRID EFFECT */}
  <div
    className="
      absolute inset-0 opacity-[0.04]
      bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),
      linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]
      bg-[size:40px_40px]
    "
  />

  {/* CONTENT */}
  <div className="relative z-10 flex flex-col justify-between p-12 lg:p-16 xl:p-20 w-full h-full">

    {/* MAIN CONTENT */}
    <div className="max-w-xl">

      {/* BADGE */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-indigo-200 text-sm font-medium mb-7">

        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

        Smart Workforce Management

      </div>


      {/* HEADING */}
      <h1 className="text-4xl lg:text-5xl xl:text-6xl font-semibold text-white mb-6 leading-[1.08] tracking-tight">

        Employee

        <br />

        <span className="text-indigo-300">
          Workflow Tracking
        </span>

        <br />

        Application

      </h1>


      {/* DESCRIPTION */}
      <p className="text-slate-300/80 text-base lg:text-lg max-w-lg leading-relaxed">

        Manage tasks, track productivity, monitor workflow,
        and understand employee performance — all from
        one powerful platform.

      </p>


      {/* FEATURES */}
      <div className="grid grid-cols-2 gap-4 mt-9 max-w-md">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="text-indigo-300">✓</span>
          </div>

          <span className="text-sm text-slate-300">
            Task Tracking
          </span>

        </div>


        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="text-indigo-300">✓</span>
          </div>

          <span className="text-sm text-slate-300">
            Productivity
          </span>

        </div>


        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="text-indigo-300">✓</span>
          </div>

          <span className="text-sm text-slate-300">
            Live Monitoring
          </span>

        </div>


        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="text-indigo-300">✓</span>
          </div>

          <span className="text-sm text-slate-300">
            Performance Reports
          </span>

        </div>

      </div>

    </div>


    {/* FOOTER */}
    <div className="flex items-center gap-3 text-sm text-slate-500">

      <div className="h-px w-10 bg-slate-700" />

      <span>
        Designed for smarter & efficient workflows
      </span>

    </div>

  </div>

</div>
  );
};
export default LoginLeftSide;