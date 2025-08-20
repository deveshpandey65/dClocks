export const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center items-center space-x-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
};