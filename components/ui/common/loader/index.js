const SIZES = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
}

const COLORS = {
  white: "white",
  red: "red",
  yellow: "bg-green"
}

export default function Loader({size="md", color="red"}) {

    return (
      <div className={`sk-cube-grid ${SIZES[size]} ${COLORS[color]}`}>
        { Array.from({length: 9}).map((_, i) =>
          <div
            key={`dot-${i}`}
            className={`sk-cube sk-cube${i + 1}`}
          />
        )}
      </div>
    )
  }