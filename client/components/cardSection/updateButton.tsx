interface ComponentProps {
  setProgress: React.Dispatch<React.SetStateAction<number>>
  setLevel: React.Dispatch<React.SetStateAction<number>>
  id: string
}
export default function UpdateButton({ setProgress, setLevel, id }: ComponentProps) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

  async function updateItem() {

    const response = await fetch(`${BASE_URL}/level-up`, {
      credentials: 'include',
      method: 'PATCH',
      body: JSON.stringify({ cardId: id }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const resData = await response.json()

    setProgress(resData.progress)
    setLevel(resData.level)
  }

  return (
    <button
      className="w-1/2 text-[9px] font-semibold bg-[#EE39A8] rounded-full h-[15px] cursor-pointer"
      style={{
        boxShadow: `inset 3px 2px 5px rgba(248, 248, 248, 0.7), inset 0 -1px 3px rgba(93, 83, 107, 0.7)`
      }}
      onClick={() => updateItem()}
    >
      Yükselt
    </button>
  );
}
