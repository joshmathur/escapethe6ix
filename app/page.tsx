import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-neutral-200 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-3xl font-semibold text-neutral-900">
            Affordable Land Communities in Northern Ontario
          </h1>
          <p className="text-lg text-neutral-600">
            A matchmaking platform connecting people priced out of Southern
            Ontario with forming land communities across Northern Ontario.
            Pledge your interest, reach community thresholds, and build
            affordable housing together.
          </p>
        </div>
      </section>

      <section className="border-b border-neutral-200 px-6 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-6">
          <div className="border border-neutral-200 p-6 text-center">
            <p className="text-sm text-neutral-500">Avg. Southern Ontario Rent</p>
            <p className="mt-2 text-2xl font-semibold text-neutral-900">
              $2,400/mo
            </p>
          </div>
          <div className="border border-neutral-200 p-6 text-center">
            <p className="text-sm text-neutral-500">
              Avg. Northern Ontario Land Cost
            </p>
            <p className="mt-2 text-2xl font-semibold text-neutral-900">
              $320/mo
            </p>
            <p className="text-xs text-neutral-400">estimated per household</p>
          </div>
          <div className="border border-neutral-200 p-6 text-center">
            <p className="text-sm text-neutral-500">Est. Monthly Savings</p>
            <p className="mt-2 text-2xl font-semibold text-green-600">
              $2,080/mo
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-xl font-semibold text-neutral-900">
            How It Works
          </h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="border border-neutral-200 p-6">
              <div className="mb-2 text-sm font-medium text-neutral-500">
                Step 1
              </div>
              <h3 className="mb-2 text-lg font-semibold text-neutral-900">
                Pledge
              </h3>
              <p className="text-sm text-neutral-600">
                Express non-binding interest in a forming community that
                matches your budget and housing preferences.
              </p>
            </div>
            <div className="border border-neutral-200 p-6">
              <div className="mb-2 text-sm font-medium text-neutral-500">
                Step 2
              </div>
              <h3 className="mb-2 text-lg font-semibold text-neutral-900">
                Match
              </h3>
              <p className="text-sm text-neutral-600">
                When enough households pledge, the community threshold triggers
                and municipal partnerships activate.
              </p>
            </div>
            <div className="border border-neutral-200 p-6">
              <div className="mb-2 text-sm font-medium text-neutral-500">
                Step 3
              </div>
              <h3 className="mb-2 text-lg font-semibold text-neutral-900">
                Build
              </h3>
              <p className="text-sm text-neutral-600">
                Work together in the community workspace to plan infrastructure,
                vote on decisions, and coordinate development.
              </p>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/explore"
              className="inline-block bg-neutral-900 px-8 py-3 text-sm font-medium text-white"
            >
              Explore Communities
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
