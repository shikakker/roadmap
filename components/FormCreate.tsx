import { useAuth0 } from '@auth0/auth0-react'

export default function FormCreate({ onSubmitNewFeature, inputNewFeature }) {
  const { user, isLoading, isAuthenticated, loginWithRedirect } = useAuth0()
  const avatarLabel = user?.name || user?.nickname || 'User'
  const avatarInitial = avatarLabel.charAt(0).toUpperCase()

  const onSubmit = (e) => {
    e.preventDefault()
    onSubmitNewFeature()
  }

  if (isLoading) return null

  return isAuthenticated ? (
    <form className="flex items-center space-x-4" onSubmit={onSubmit}>
      <span
        aria-label={`${avatarLabel} avatar`}
        className="flex h-10 w-10 items-center justify-center rounded bg-zinc-200 font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100"
        role="img"
      >
        {avatarInitial}
      </span>
      <input
        className="form-input"
        type="text"
        ref={inputNewFeature}
        placeholder="Enter a new feature request?"
      />
    </form>
  ) : (
    <div
      className="flex flex-col items-center bg-zinc-100 px-3 py-6 rounded
    dark:bg-zinc-800"
    >
      <p>Please login to request or vote for a new feature</p>
      <button
        className="button mt-4"
        type="button"
        onClick={() => loginWithRedirect()}
      >
        Login
      </button>
    </div>
  )
}
