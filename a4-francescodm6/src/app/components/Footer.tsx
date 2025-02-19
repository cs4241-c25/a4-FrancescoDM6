// src/components/Footer.tsx
export default function Footer() {
    return (
        <footer className="mt-auto border-t border-border">
            <div className="max-w-7xl mx-auto px-4 py-6 text-center">
                <p className="text-lg font-semibold opacity-100 transition-opacity duration-500">
                    Play Score = (Priority × 15 × Status weight) + Time to beat
                </p>
            </div>
        </footer>
    );
}