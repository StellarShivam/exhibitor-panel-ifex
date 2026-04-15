export function ImportantNotes() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-2">
            <div className="space-y-2 p-4 rounded-lg bg-gray-200">
                <p className="font-semibold text-gray-800">Important Note:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Each company is eligible for ONE single entry only.</li>
                    <li>Any Incomplete/Incorrect data will invalidate your application.</li>
                    <li>
                        The layout gets updated frequently, request you to download the layout
                        file just before the payment and application form submission.
                    </li>
                </ul>
            </div>
            <div className="space-y-3 p-4 rounded-lg bg-gray-200">
                <div>
                    <p className="font-semibold text-gray-800">Note To All Domestic Exhibitors:</p>
                    <p className="text-gray-600 mt-1">
                        Please keep the payment details made to IEML handy before proceeding.
                        The subsequent section needs these details to be duly filled in.
                    </p>
                </div>
                <div>
                    <p className="font-semibold text-gray-800">Note To All Overseas (Non-Indian) Exhibitors:</p>
                    <p className="text-gray-600 mt-1">
                        Please contact IEML before proceeding any further.
                    </p>
                </div>
            </div>
        </div>
    );
}
