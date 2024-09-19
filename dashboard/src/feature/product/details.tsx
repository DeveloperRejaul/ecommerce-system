import { useLocation } from "react-router-dom";

export default function ProductDetails() {
    const { state } = useLocation();

    return (
        <div>
            <h1>Product Details</h1>
        </div>
    );
}
