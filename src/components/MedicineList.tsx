import type { Medicine } from "../types/medicine";
import MedicineCard from "./Medicinecard";

interface MedicineListProps {
    medicines: Medicine[];
    onMedicineClick: (medicine: Medicine, index: number) => void;
}

function MedicineList({
    medicines,
    onMedicineClick,
}: MedicineListProps) {
    return (
        <div className="medicine-grid">
            {medicines.map((medicine, index) => (
                <MedicineCard
                    key={index}
                    medicine={medicine}
                    onClick={() => onMedicineClick(medicine, index)}
                />
            ))}
        </div>
    );
}

export default MedicineList;