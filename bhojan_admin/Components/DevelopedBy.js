const DEVELOPERS = [
  "Rishad Baniya",
  "Anish Pradhan",
  "Kapil Adhikari",
  "Rojan Gautam",
];

const DevelopedBy = () => {
  return (
    <>
      <div className="developed_by">
        <div className="developed_by__title">Developed By</div>
        <hr className="developed_by__horizontal_division" />
        <div className="developed_by__developers">{DEVELOPERS[0]}</div>
        <div className="developed_by__developers">{DEVELOPERS[1]}</div>
        <div className="developed_by__developers">{DEVELOPERS[2]}</div>
        <div className="developed_by__developers">{DEVELOPERS[3]}</div>
      </div>
    </>
  );
};

export default DevelopedBy;