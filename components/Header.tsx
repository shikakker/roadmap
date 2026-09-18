import Image from 'next/image'
import { useTheme } from 'next-themes'

export default function Header() {
  const { resolvedTheme } = useTheme()

  return (
    <header className="pt-20 mb-12">
      <div className="flex justify-center">
        <Image
          src={resolvedTheme === 'light' ? '/logo-light.svg' : '/logo-dark.svg'}
          alt="Upstash"
          width={140}
          height={41}
          priority
        />
      </div>

      <div className="mt-6 text-center text-dimmed">
        <p>Help us by voting our roadmap.</p>
        <p>Vote up the features you want to see in the next release.</p>
      </div>
    </header>
  )
}
