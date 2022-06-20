export const Loader = ({ text = null }) => (
  <div className="loading">
    <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    {text && <p>{text}</p>}
  </div>
)