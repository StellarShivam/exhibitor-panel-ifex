export function IifNonMemberNotice() {
    return (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-300 text-sm text-gray-700 leading-relaxed">
            Non-members will have to pay Associate Membership fee for participation in IFEX 2027.
            If you don't have IIF membership, please{" "}
            <a
                href="https://www.indianfoundry.org/membership.php"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
            >
                click here
            </a>{" "}
            to get membership subscription. Till then you can proceed with completing form.
        </div>
    );
}
