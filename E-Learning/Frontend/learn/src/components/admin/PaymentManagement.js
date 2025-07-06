import React, { useState, useEffect } from "react"
import "./PaymentManagement.css"

const PaymentManagement = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState({
    status: "",
    page: 1,
    limit: 20,
  })
  const [totalPages, setTotalPages] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundForm, setRefundForm] = useState({
    amount: "",
    reason: "",
  })

  useEffect(() => {
    fetchPayments()
  }, [filter])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const queryParams = new URLSearchParams({
        page: filter.page,
        limit: filter.limit,
        ...(filter.status && { status: filter.status }),
      })

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/admin/all?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to fetch payments")

      const data = await response.json()
      setPayments(data.payments)
      setTotalPages(data.totalPages)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = async (paymentId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/${paymentId}/refund`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: refundForm.amount ? parseFloat(refundForm.amount) : undefined,
          reason: refundForm.reason,
        }),
      })

      if (!response.ok) throw new Error("Failed to process refund")

      await response.json()
      setShowRefundModal(false)
      setRefundForm({ amount: "", reason: "" })
      fetchPayments() // Refresh the list
      alert("Refund processed successfully")
    } catch (error) {
      alert(`Error processing refund: ${error.message}`)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
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

  if (loading) {
    return <div className="loading-spinner">Loading payments...</div>
  }

  return (
    <div className="payment-management">
      <div className="payment-header">
        <h1>Payment Management</h1>
        <div className="payment-stats">
          <div className="stat-card">
            <h3>Total Payments</h3>
            <p>{payments.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p>
              {formatCurrency(
                payments
                  .filter((p) => p.status === "completed")
                  .reduce((sum, p) => sum + p.amount, 0),
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="payment-filters">
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value, page: 1 })}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="payments-table">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Student</th>
              <th>Course</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.transactionId}</td>
                <td>{payment.student?.name}</td>
                <td>{payment.course?.title}</td>
                <td>{formatCurrency(payment.amount)}</td>
                <td>{getStatusBadge(payment.status)}</td>
                <td>{formatDate(payment.paymentDate)}</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    View
                  </button>
                  {payment.status === "completed" && (
                    <button
                      className="btn-refund"
                      onClick={() => {
                        setSelectedPayment(payment)
                        setShowRefundModal(true)
                        setRefundForm({ amount: payment.amount.toString(), reason: "" })
                      }}
                    >
                      Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={filter.page <= 1}
          onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
        >
          Previous
        </button>
        <span>
          Page {filter.page} of {totalPages}
        </span>
        <button
          disabled={filter.page >= totalPages}
          onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
        >
          Next
        </button>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && !showRefundModal && (
        <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Payment Details</h3>
              <button className="modal-close" onClick={() => setSelectedPayment(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <label>Transaction ID:</label>
                <span>{selectedPayment.transactionId}</span>
              </div>
              <div className="detail-row">
                <label>Student:</label>
                <span>{selectedPayment.student?.name} ({selectedPayment.student?.email})</span>
              </div>
              <div className="detail-row">
                <label>Course:</label>
                <span>{selectedPayment.course?.title}</span>
              </div>
              <div className="detail-row">
                <label>Amount:</label>
                <span>{formatCurrency(selectedPayment.amount)}</span>
              </div>
              <div className="detail-row">
                <label>Payment Method:</label>
                <span>{selectedPayment.paymentMethod}</span>
              </div>
              <div className="detail-row">
                <label>Status:</label>
                {getStatusBadge(selectedPayment.status)}
              </div>
              <div className="detail-row">
                <label>Payment Date:</label>
                <span>{formatDate(selectedPayment.paymentDate)}</span>
              </div>
              {selectedPayment.refundDate && (
                <div className="detail-row">
                  <label>Refund Date:</label>
                  <span>{formatDate(selectedPayment.refundDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="modal-overlay" onClick={() => setShowRefundModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Process Refund</h3>
              <button className="modal-close" onClick={() => setShowRefundModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Refund Amount:</label>
                <input
                  type="number"
                  step="0.01"
                  value={refundForm.amount}
                  onChange={(e) => setRefundForm({ ...refundForm, amount: e.target.value })}
                  placeholder={`Max: ${selectedPayment?.amount}`}
                />
              </div>
              <div className="form-group">
                <label>Reason:</label>
                <textarea
                  value={refundForm.reason}
                  onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                  placeholder="Enter refund reason"
                  required
                />
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowRefundModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn-confirm"
                  onClick={() => handleRefund(selectedPayment._id)}
                  disabled={!refundForm.reason}
                >
                  Process Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentManagement