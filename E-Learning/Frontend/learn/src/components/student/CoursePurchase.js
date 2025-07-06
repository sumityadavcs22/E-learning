import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./CoursePurchase.css"

const CoursePurchase = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("stripe")
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentData, setPaymentData] = useState(null)
  const [step, setStep] = useState("review") // review, payment, processing, success

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch course")

      const data = await response.json()
      setCourse(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const initiatePayment = async () => {
    try {
      setPaymentLoading(true)
      const token = localStorage.getItem("token")

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/create-payment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          paymentMethod,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message)
      }

      const data = await response.json()
      setPaymentData(data)

      if (data.payment?.amount === 0) {
        // Free course - enrollment completed
        setStep("success")
      } else {
        // Paid course - proceed to payment
        setStep("payment")
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setPaymentLoading(false)
    }
  }

  const confirmPayment = async () => {
    try {
      setPaymentLoading(true)
      setStep("processing")

      const token = localStorage.getItem("token")

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/confirm-payment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: paymentData.payment._id,
          paymentIntentId: `pi_${Date.now()}`, // Simulated payment intent ID
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message)
      }

      const data = await response.json()
      setStep("success")
    } catch (error) {
      setError(error.message)
      setStep("payment")
    } finally {
      setPaymentLoading(false)
    }
  }

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  if (loading) {
    return <div className="loading-spinner">Loading course details...</div>
  }

  if (error && !course) {
    return (
      <div className="purchase-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="btn-back">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="course-purchase">
      <div className="purchase-container">
        {step === "review" && (
          <div className="purchase-review">
            <div className="course-summary">
              <img
                src={course.thumbnail || "/api/placeholder/300/200"}
                alt={course.title}
                className="course-image"
              />
              <div className="course-info">
                <h1>{course.title}</h1>
                <p className="instructor">by {course.instructor?.name}</p>
                <p className="course-description">{course.shortDescription || course.description}</p>
                
                <div className="course-details">
                  <div className="detail-item">
                    <span className="icon">📚</span>
                    <span>{course.lessons?.length || 0} Lessons</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">⏱️</span>
                    <span>{Math.round(course.totalDuration / 60)} Hours</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">📊</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">⭐</span>
                    <span>{course.averageRating?.toFixed(1) || "New"} ({course.totalRatings || 0} reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="purchase-summary">
              <h3>Purchase Summary</h3>
              <div className="price-breakdown">
                <div className="price-item">
                  <span>Course Price</span>
                  <span className="price">{formatCurrency(course.price)}</span>
                </div>
                <div className="price-item total">
                  <span>Total</span>
                  <span className="price">{formatCurrency(course.price)}</span>
                </div>
              </div>

              <div className="payment-method-selection">
                <h4>Payment Method</h4>
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="method-info">
                      <span className="method-name">Credit Card</span>
                      <span className="method-description">Visa, Mastercard, American Express</span>
                    </span>
                  </label>
                  <label className="payment-method">
                    <input
                      type="radio"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="method-info">
                      <span className="method-name">PayPal</span>
                      <span className="method-description">Pay with your PayPal account</span>
                    </span>
                  </label>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="purchase-actions">
                <button onClick={() => navigate(-1)} className="btn-cancel">
                  Cancel
                </button>
                <button
                  onClick={initiatePayment}
                  disabled={paymentLoading}
                  className="btn-purchase"
                >
                  {paymentLoading ? "Processing..." : `Purchase for ${formatCurrency(course.price)}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "payment" && paymentData && (
          <div className="payment-form">
            <h2>Complete Your Payment</h2>
            <div className="payment-details">
              <p>Amount: {formatCurrency(paymentData.payment.amount)}</p>
              <p>Transaction ID: {paymentData.payment.transactionId}</p>
            </div>

            {paymentMethod === "stripe" && (
              <div className="stripe-form">
                <h3>Credit Card Information</h3>
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="card-input"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="card-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="card-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="card-input"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div className="paypal-form">
                <p>You will be redirected to PayPal to complete your payment.</p>
              </div>
            )}

            <div className="payment-actions">
              <button onClick={() => setStep("review")} className="btn-back">
                Back
              </button>
              <button
                onClick={confirmPayment}
                disabled={paymentLoading}
                className="btn-pay"
              >
                {paymentLoading ? "Processing..." : `Pay ${formatCurrency(paymentData.payment.amount)}`}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>
        )}

        {step === "processing" && (
          <div className="payment-processing">
            <div className="processing-spinner"></div>
            <h2>Processing Your Payment</h2>
            <p>Please wait while we process your payment...</p>
          </div>
        )}

        {step === "success" && (
          <div className="payment-success">
            <div className="success-icon">✅</div>
            <h2>Payment Successful!</h2>
            <p>You have successfully enrolled in "{course.title}"</p>
            <div className="success-actions">
              <button
                onClick={() => navigate(`/course/${courseId}`)}
                className="btn-start"
              >
                Start Learning
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-dashboard"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursePurchase