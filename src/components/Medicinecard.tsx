import type { Medicine } from "../types/medicine";

interface MedicineCardProps {
  medicine: Medicine;
  onClick: () => void;
}

function getValue(value?: string[]) {
    if (!value || value.length === 0) return "N/A";
    return value.join(", ");
}

function MedicineCard({medicine, onClick}: MedicineCardProps) {
    const openfda = medicine.openfda;

    return (
        <article className="medicine-card" onClick={onClick}>

            <div className="medicine-card-header">
                <h2>{getValue(openfda?.brand_name)}</h2>
            </div>
            <div className="medicine-details">
                <div className="detail-row">
                    <span>Generic Name</span>
                    <strong>
                        {getValue(openfda?.generic_name)}
                    </strong>
                </div>
                <div className="detail-row">
                    <span>Manufacturer</span>
                    <strong>
                        {getValue(openfda?.manufacturer_name)}
                    </strong>
                </div>
                <div className="detail-row">
                    <span>Route</span>
                    <strong>
                        {getValue(openfda?.route)}
                    </strong>
                </div>
                <div className="detail-row">
                    <span>Substance</span>
                    <strong>
                        {getValue(openfda?.substance_name)}
                    </strong>
                </div>
            </div>

            <div className="card-footer">
                <span>View deatils..</span>
            </div>
        </article>
    );
}
export default MedicineCard;