import "./SkeletonLoader.css";

export default function SkeletonLoader({ className = "", style }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

