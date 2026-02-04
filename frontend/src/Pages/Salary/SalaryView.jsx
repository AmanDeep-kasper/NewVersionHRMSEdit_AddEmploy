import React from "react";
import Logo from "../../img/logo.png";
import { FaFilePdf } from "react-icons/fa";
import { BsFiletypeCsv } from "react-icons/bs";
import { IoMdPrint } from "react-icons/io";

const SalaryView = ({ salary, setViewingSalary }) => {
  const closePayslip = () => {
    setViewingSalary(null);
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content container-fluid pb-0">
          <div className="page-header">
            <div className="row align-items-center">
              {/* <div className="col">
                <h3 className="page-title">Payslip</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="admin-dashboard.html">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">Payslip</li>
                </ul>
              </div> */}
              <div className="col-auto float-end ms-auto">
                <div className="btn-group btn-group-sm">
                  <button className="btn btn-white">
                    <BsFiletypeCsv />
                    CSV
                  </button>
                  <button className="btn btn-white">
                    <FaFilePdf />
                    PDF
                  </button>
                  <button className="btn btn-white">
                    <IoMdPrint />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="payslip-title">
                    Payslip for the month of Feb 2019
                  </h4>
                  <div className="row">
                    <div className="col-sm-6 m-b-20">
                      <img src={Logo} className="inv-logo" alt="Logo" />
                      <ul className="list-unstyled mb-0">
                        <li> iThum Towers, Office Number 214,Tower B,</li>
                        <li>Noida, Uttar Pradesh, India</li>
                        {/* <li>Sherman Oaks, CA, 91403</li> */}
                      </ul>
                    </div>
                    <div className="col-sm-6 m-b-20">
                      <div className="invoice-details">
                        <h3 className="text-uppercase">Payslip #49029</h3>
                        <ul className="list-unstyled">
                          <li>
                            Salary Month: <span>March, 2019</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 m-b-20">
                      <ul className="list-unstyled">
                        <li>
                          <h5 className="mb-0">
                            <strong>{salary.EmployeeName}</strong>
                          </h5>
                        </li>
                        <li>
                          <span>{salary.PositionName}</span>
                        </li>
                        <li>Employee ID: {salary.empID}</li>
                        <li>Joining Date: 1 Jan 2024</li>
                      </ul>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-6">
                      <div>
                        <h4 className="m-b-10">
                          <strong>Earnings</strong>
                        </h4>
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <td>
                                <strong>Basic Salary</strong>{" "}
                                <span className="float-end">
                                  ₹{salary.BasicSalary}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>House Rent Allowance (H.R.A.)</strong>{" "}
                                <span className="float-end">
                                  ₹{salary.HRASalary}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Medical Allowance</strong>{" "}
                                <span className="float-end">
                                  ₹{salary.MAllowance}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Other Allowance</strong>{" "}
                                <span className="float-end">
                                  ₹{salary.otherAllowance}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Total Earnings</strong>{" "}
                                <span className="float-end">
                                  <strong>₹{salary.totalSalary}</strong>
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div>
                        <h4 className="m-b-10">
                          <strong>Deductions</strong>
                        </h4>
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <td>
                                <strong>Tax Deducted at Source (T.D.S.)</strong>{" "}
                                <span className="float-end">
                                  ₹{salary.TaxDeduction}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Provident Fund</strong>{" "}
                                <span className="float-end">
                                  ₹{salary.PFDeduct}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>ESI</strong>{" "}
                                <span className="float-end">₹0</span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Leave </strong>{" "}
                                <span className="float-end">
                                  ₹{salary.LeaveDeduct}
                                </span>
                              </td>
                            </tr>
                            {/* <tr>
                              <td>
                                <strong>Total Deductions</strong>{" "}
                                <span className="float-end">
                                  <strong>₹59698</strong>
                                </span>
                              </td>
                            </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <p>
                        <strong>Net Salary: ₹{salary.totalSalary}</strong>{" "}
                        {/* (Fifty nine thousand six hundred and ninety eight only.) */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryView;
