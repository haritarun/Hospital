import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { FaEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from "axios";
import moment from 'moment';

const AdminCategory = () => {
    const [tableData, setTableData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newRow, setNewRow] = useState({
        tabletName: '',
        deskno: '',
        mfgDate: '',
        expDate: '',
        noOfSets: '1',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/getdata');
                if (response.status === 200) {
                    const fetchedData = response.data.map(eachItem => ({
                        ...eachItem,
                        tabletName: eachItem.tabletName,
                        deskno: eachItem.deskno,
                        mfgDate: moment(eachItem.mfgDate).format('DD-MM-YYYY'),
                        expDate: moment(eachItem.expDate).format('DD-MM-YYYY'),
                        noOfSets: eachItem.noOfSets,
                    }));
                    setTableData(fetchedData);
                } else {
                    console.error('Error fetching data:', response.status);
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, []);

    const handleNewRowChange = (e) => {
        const { name, value } = e.target;
        setNewRow((prevRow) => ({
            ...prevRow,
            [name]: value,
        }));
    };

    const handleSaveNewRow = async () => {
        // Ensure all fields are filled before proceeding
        if (
            newRow.tabletName &&
            newRow.deskno &&
            newRow.mfgDate &&
            newRow.expDate &&
            newRow.noOfSets
        ) {
            try {
                if (editingIndex !== null) {
                    try {
                        const response = await axios.put('http://localhost:3000/updatetablet', {
                            tabletName: newRow.tabletName, // Using tabletName as the unique identifier
                            deskno: newRow.deskno,
                            mfgDate: newRow.mfgDate,
                            expDate: newRow.expDate,
                            noOfSets: newRow.noOfSets,
                        });

                        if (response.status === 200) {
                            alert('Tablet updated successfully');
                            const updatedTableData = [...tableData];
                            updatedTableData[editingIndex] = newRow; // Update the row in the table data
                            setTableData(updatedTableData);
                            setEditingIndex(null);
                            setIsModalOpen(false);
                        } else {
                            alert('Failed to update tablet. Please try again.');
                        }
                    } catch (error) {
                        console.error('Error updating tablet:', error.response?.data || error.message);
                        alert(error.response?.data?.message || 'Failed to update tablet.');
                    }
                } else {
                    // Adding a new tablet
                    try {
                        const response = await axios.post('http://localhost:3000/tablets', {
                            tabletName: newRow.tabletName,
                            deskno: newRow.deskno,
                            mfgDate: newRow.mfgDate,
                            expDate: newRow.expDate,
                            noOfSets: newRow.noOfSets,
                        });

                        if (response.status === 201) {
                            alert('Tablet added successfully');
                            setTableData((prevTableData) => [...prevTableData, newRow]); // Append the new row

                            // Reset the form fields
                            setNewRow({
                                tabletName: '',
                                deskno: '',
                                mfgDate: '',
                                expDate: '',
                                noOfSets: '',
                            });
                            setEditingIndex(null);
                            setIsModalOpen(false);
                        } else {
                            alert('Failed to add tablet. Please try again.');
                        }
                    } catch (error) {
                        console.error('Error adding tablet:', error.response?.data || error.message);
                        alert(error.response?.data?.message || 'Failed to add tablet.');
                    }
                }
            } catch (error) {
                console.error('Error saving tablet:', error.response?.data || error.message);
                alert(error.response?.data?.message || 'Failed to save tablet. Please try again.');
            }
        } else {
            // Show alert if required fields are empty
            alert('Please fill out all fields.');
        }
    };

    const handleDeleteRow = async () => {
        try {
            const response = await axios.delete('http://localhost:3000/delete', {
                data: { tabletName: tableData[deleteIndex].tabletName },
            });

            if (response.status === 200) {
                alert(response.data.message);
                const updatedTableData = [...tableData];
                updatedTableData.splice(deleteIndex, 1);
                setTableData(updatedTableData);
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert(error.response?.data?.message || 'An error occurred');
        }
        setDeleteIndex(null);
        setIsDeletePopupOpen(false);
    };

    const handleEditRow = async (index) => {
        setNewRow(tableData[index]);
        setEditingIndex(index);
        setIsModalOpen(true);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const filteredData = tableData.filter((row) =>
        row.tabletName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    return (
        <div className="flex  flex-col md:flex-row h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
                    } md:block bg-gray-800 text-white flex flex-col fixed inset-0 z-50 transition-transform duration-300 md:relative md:translate-x-0`}
            >
                <div className="p-4 text-center font-bold text-xl border-b border-gray-700 flex justify-between items-center">
                    <span>Admin Dashboard</span>
                    <button
                        aria-label="Close Sidebar"
                        className="block md:hidden text-gray-300 hover:text-white"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        ✕
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-4">
                    <Link to="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700 transition">
                        Dashboard
                    </Link>
                    <Link to="/adminchatpage" className="block py-2 px-4 rounded hover:bg-gray-700 transition">
                        Chats
                    </Link>
                    <Link to="/admincategory" className="block py-2 px-4 rounded hover:bg-gray-700 transition">
                        Store
                    </Link>
                    <Link to="/reports" className="block py-2 px-4 rounded hover:bg-gray-700 transition">
                        Reports
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 p-6 ml-0 ">
                <div className="mb-6 w-full flex justify-between items-center">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden text-blue-600"
                    >
                        <FaBars size={30} />
                    </button>
                    <input
                        type="text"
                        placeholder="Search by Tablet Name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="text-blue-600 py-2 px-4 border border-blue-300 rounded-md w-1/3"
                    />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center"
                    >
                        <FaPlus className="mr-2" />
                    </button>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="py-3 px-6">Tablet Name</th>
                                <th className="py-3 px-6">Desk No</th>
                                <th className="py-3 px-6">Mfg Date</th>
                                <th className="py-3 px-6">Exp Date</th>
                                <th className="py-3 px-6">No of Sets</th>
                                <th className="py-3 px-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-3 px-6">{row.tabletName}</td>
                                    <td className="py-3 px-6">{row.deskno}</td>
                                    <td className="py-3 px-6">{row.mfgDate}</td>
                                    <td className="py-3 px-6">{row.expDate}</td>
                                    <td className="py-3 px-6">{row.noOfSets}</td>
                                    <td className="py-3 px-6">
                                        <button
                                            onClick={() => handleEditRow(index)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDeleteIndex(index);
                                                setIsDeletePopupOpen(true);
                                            }}
                                            className="ml-3 text-red-600 hover:text-red-800"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    >
                        <FaChevronLeft />
                    </button>
                    <span className="text-lg">{`${currentPage} / ${totalPages}`}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>

            {/* Modal for Add/Edit Tablet */}
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-[90%] sm:w-[75%] md:w-[50%] lg:w-[40%] xl:w-[30%]">
                        <h2 className="text-2xl font-bold text-center mb-6">Add / Edit Tablet</h2>
                        <div className="flex flex-col space-y-4">
                            <input
                                type="text"
                                name="tabletName"
                                placeholder="Tablet Name"
                                value={newRow.tabletName}
                                onChange={handleNewRowChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            />
                            <input
                                type="text"
                                name="deskno"
                                placeholder="Desk No"
                                value={newRow.deskno}
                                onChange={handleNewRowChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            />
                            <input
                                type="date"
                                name="mfgDate"
                                placeholder="Manufacturing Date"
                                value={newRow.mfgDate}
                                onChange={handleNewRowChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            />
                            <input
                                type="date"
                                name="expDate"
                                placeholder="Expiry Date"
                                value={newRow.expDate}
                                onChange={handleNewRowChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            />
                            <input
                                type="text"
                                name="noOfSets"
                                placeholder="Number of Sets"
                                value={newRow.noOfSets}
                                onChange={handleNewRowChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveNewRow}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Popup */}
            {isDeletePopupOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-[90%] sm:w-[75%] md:w-[50%] lg:w-[40%] xl:w-[30%]">
                        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
                            Are you sure you want to delete this tablet?
                        </h2>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsDeletePopupOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteRow}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategory;
