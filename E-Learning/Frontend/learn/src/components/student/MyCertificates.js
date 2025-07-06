import React, { useState, useEffect } from "react"
import "./MyCertificates.css"

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("certificates")
  const [selectedCertificate, setSelectedCertificate] = useState(null)

  useEffect(() => {
    fetchCertificates()
    fetchPayments()
  }, [])

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/certificates/my-certificates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch certificates")

      const data = await response.json()
      setCertificates(data)
    } catch (error) {
      setError(error.message)
    }
  }

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch payment history")

      const data = await response.json()
      setPayments(data.payments)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const downloadCertificate = (certificate) => {
    // In a real implementation, this would generate a PDF certificate
    const certificateData = {
      certificateId: certificate.certificateId,
      studentName: certificate.student?.name,
      courseTitle: certificate.course?.title,
      instructorName: certificate.instructor?.name,
      issuedAt: certificate.issuedAt,
      grade: certificate.grade,
      scorePercentage: certificate.scorePercentage,
    }

    const blob = new Blob([JSON.stringify(certificateData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `certificate-${certificate.certificateId}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: "status-completed",
      pending: "status-pending",
      failed: "status-failed",
      refunded: "status-refunded",
      cancelled: "status-cancelled",
    }

    return <span className={`status-badge ${statusClasses[status]}`}>{status.toUpperCase()}</span>
  }

  const getGradeBadge = (grade) => {
    const gradeClasses = {
      "A+": "grade-aplus",
      A: "grade-a",
      "B+": "grade-bplus",
      B: "grade-b",
      "C+": "grade-cplus",
      C: "grade-c",
      Pass: "grade-pass",
    }

    return <span className={`grade-badge ${gradeClasses[grade]}`}>{grade}</span>
  }

  if (loading) {
    return <div className="loading-spinner">Loading your achievements...</div>
  }

  return (
    <div className="my-certificates">
      <div className="certificates-header">
        <h1>My Achievements</h1>
        <p>View your certificates and payment history</p>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "certificates" ? "active" : ""}`}
          onClick={() => setActiveTab("certificates")}
        >
          Certificates ({certificates.length})
        </button>
        <button
          className={`tab-button ${activeTab === "payments" ? "active" : ""}`}
          onClick={() => setActiveTab("payments")}
        >
          Payment History ({payments.length})
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {activeTab === "certificates" && (
        <div className="certificates-section">
          {certificates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏆</div>
              <h3>No Certificates Yet</h3>
              <p>Complete courses to earn certificates and showcase your achievements!</p>
            </div>
          ) : (
            <div className="certificates-grid">
              {certificates.map((certificate) => (
                <div key={certificate._id} className="certificate-card">
                  <div className="certificate-header">
                    <div className="certificate-icon">🎓</div>
                    <div className="certificate-grade">
                      {getGradeBadge(certificate.grade)}
                    </div>
                  </div>
                  <div className="certificate-content">
                    <h3>{certificate.course?.title}</h3>
                    <p className="instructor">Instructor: {certificate.instructor?.name}</p>
                    <div className="certificate-details">
                      <div className="detail-item">
                        <span className="label">Completed:</span>
                        <span className="value">{formatDate(certificate.completionDate)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Score:</span>
                        <span className="value">{certificate.scorePercentage}%</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Certificate ID:</span>
                        <span className="value certificate-id">{certificate.certificateId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="certificate-actions">
                    <button
                      className="btn-view"
                      onClick={() => setSelectedCertificate(certificate)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn-download"
                      onClick={() => downloadCertificate(certificate)}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "payments" && (
        <div className="payments-section">
          {payments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💳</div>
              <h3>No Payment History</h3>
              <p>Your course purchase history will appear here.</p>
            </div>
          ) : (
            <div className="payments-table">
              <table>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Date</th>
                    <th>Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>
                        <div className="course-info">
                          {payment.course?.thumbnail && (
                            <img 
                              src={payment.course.thumbnail} 
                              alt={payment.course.title}
                              className="course-thumbnail"
                            />
                          )}
                          <span>{payment.course?.title}</span>
                        </div>
                      </td>
                      <td>{formatCurrency(payment.amount)}</td>
                      <td>{getStatusBadge(payment.status)}</td>
                      <td>{formatDate(payment.paymentDate)}</td>
                      <td className="transaction-id">{payment.transactionId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Certificate Details Modal */}
      {selectedCertificate && (
        <div className="modal-overlay" onClick={() => setSelectedCertificate(null)}>
          <div className="modal-content certificate-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Certificate Details</h3>
              <button className="modal-close" onClick={() => setSelectedCertificate(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="certificate-preview">
                <div className="certificate-border">
                  <div className="certificate-inner">
                    <div className="certificate-title">Certificate of Completion</div>
                    <div className="certificate-subtitle">This is to certify that</div>
                    <div className="student-name">{selectedCertificate.student?.name || "Student Name"}</div>
                    <div className="certificate-subtitle">has successfully completed</div>
                    <div className="course-title">{selectedCertificate.course?.title}</div>
                    <div className="certificate-details-grid">
                      <div className="detail">
                        <strong>Instructor:</strong> {selectedCertificate.instructor?.name}
                      </div>
                      <div className="detail">
                        <strong>Completion Date:</strong> {formatDate(selectedCertificate.completionDate)}
                      </div>
                      <div className="detail">
                        <strong>Grade:</strong> {selectedCertificate.grade}
                      </div>
                      <div className="detail">
                        <strong>Score:</strong> {selectedCertificate.scorePercentage}%
                      </div>
                    </div>
                    <div className="certificate-id-display">
                      Certificate ID: {selectedCertificate.certificateId}
                    </div>
                  </div>
                </div>
              </div>
              <div className="certificate-actions-modal">
                <button
                  className="btn-download"
                  onClick={() => downloadCertificate(selectedCertificate)}
                >
                  Download Certificate
                </button>
                <button
                  className="btn-share"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/verify/${selectedCertificate.certificateId}`
                    navigator.clipboard.writeText(shareUrl)
                    alert("Verification link copied to clipboard!")
                  }}
                >
                  Share Verification Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyCertificates