interface ComponentProps {
  message: string | boolean
}

export default function Error({ message }: ComponentProps) {
  return (
    <div className="flex justify-center items-center w-full">
      <p>{message}</p>
    </div>
  )
}