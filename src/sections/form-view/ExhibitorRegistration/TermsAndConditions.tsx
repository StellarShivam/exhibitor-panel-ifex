export function TermsAndConditions() {
    return (
        <div className="rounded-lg ">
            <h3 className="text-md font-semibold text-gray-800 mb-1">
                Terms & Conditions / General Regulations
            </h3>
            <ul className="space-y-1 text-gray-500">
                <li className="flex gap-3">
                    <span className="text-gray-400 font-semibold">•</span>
                    <span>
                        Please read the{' '}
                        <a
                            href="#"
                            className="text-red-500 font-semibold hover:underline"
                        >
                            Terms and Conditions
                        </a>
                        {' '}carefully before proceeding with the registration.
                    </span>
                </li>
                <li className="flex gap-3">
                    <span className="text-gray-400 font-semibold">•</span>
                    <span>
                        Sign below to confirm your acceptance of the terms and conditions.
                    </span>
                </li>
            </ul>
        </div>
    );
}
