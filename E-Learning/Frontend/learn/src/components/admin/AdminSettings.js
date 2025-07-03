"use client"

import { useState, useEffect } from "react"
import AdminLayout from "./AdminLayout"
import Modal from "../common/Modal"
import "./AdminSettings.css"

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: "LearnHub",
      siteDescription: "Transform Your Future with Expert-Led Learning",
      contactEmail: "admin@learnhub.com",
      supportEmail: "support@learnhub.com",
      timezone: "UTC",
      language: "en",
      maintenanceMode: false,
    },
    platform: {
      allowRegistration: true,
      requireEmailVerification: true,
      autoApproveInstructors: false,
      maxFileUploadSize: 10, // MB
      sessionTimeout: 30, // minutes
      maxLoginAttempts: 5,
    },
    payment: {
      currency: "USD",
      taxRate: 0.08,
      commissionRate: 0.15,
      minimumPayout: 50,
      payoutSchedule: "monthly",
      stripePublishableKey: "",
      stripeSecretKey: "",
    },
    email: {
      smtpHost: "",
      smtpPort: 587,
      smtpUsername: "",
      smtpPassword: "",
      fromEmail: "noreply@learnhub.com",
      fromName: "LearnHub",
    },
    security: {
      enableTwoFactor: false,
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionSecure: true,
      enableRateLimiting: true,
      maxApiRequests: 1000, // per hour
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: false,
      newUserNotification: true,
      newCourseNotification: true,
      paymentNotification: true,
    },
  })

  const [activeTab, setActiveTab] = useState("general")
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [backupData, setBackupData] = useState(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // Mock API call - replace with actual API
      console.log("Fetching settings...")
    } catch (error) {
      console.error("Error fetching settings:", error)
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // Mock API call - replace with actual API
      console.log("Saving settings:", settings)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error saving settings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const handleBackupData = async () => {
    try {
      // Mock backup data
      const backup = {
        timestamp: new Date().toISOString(),
        users: 15420,
        courses: 245,
        enrollments: 8930,
        settings: settings
      }
      
      setBackupData(backup)
      
      // Create downloadable backup file
      const dataStr = JSON.stringify(backup, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `learnhub-backup-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      
      alert("Backup created and downloaded successfully!")
    } catch (error) {
      console.error("Error creating backup:", error)
      alert("Error creating backup. Please try again.")
    }
  }

  const handleRestoreData = () => {
    setModalType("restore")
    setShowModal(true)
  }

  const handleClearCache = async () => {
    try {
      // Mock cache clearing
      console.log("Clearing cache...")
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert("Cache cleared successfully!")
    } catch (error) {
      console.error("Error clearing cache:", error)
      alert("Error clearing cache. Please try again.")
    }
  }

  const tabs = [
    { id: "general", label: "General", icon: "⚙️" },
    { id: "platform", label: "Platform", icon: "🏛️" },
    { id: "payment", label: "Payment", icon: "💳" },
    { id: "email", label: "Email", icon: "📧" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
  ]

  return (
    <AdminLayout>
      <div className="admin-settings">
        <div className="page-header">
          <div>
            <h1>Platform Settings</h1>
            <p>Configure and manage platform settings</p>
          </div>
          <div className="header-actions">
            <button onClick={handleBackupData} className="btn btn-secondary">
              📥 Backup Data
            </button>
            <button onClick={handleRestoreData} className="btn btn-secondary">
              📤 Restore Data
            </button>
            <button onClick={handleClearCache} className="btn btn-secondary">
              🗑️ Clear Cache
            </button>
            <button 
              onClick={handleSaveSettings} 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>

        <div className="settings-container">
          {/* Settings Tabs */}
          <div className="settings-sidebar">
            <nav className="settings-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`settings-nav-item ${activeTab === tab.id ? "active" : ""}`}
                >
                  <span className="nav-icon">{tab.icon}</span>
                  <span className="nav-label">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="settings-content">
            {activeTab === "general" && (
              <div className="settings-section">
                <h2>General Settings</h2>
                <div className="settings-grid">
                  <div className="form-group">
                    <label className="form-label">Site Name</label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => handleSettingChange("general", "siteName", e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Email</label>
                    <input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => handleSettingChange("general", "contactEmail", e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Support Email</label>
                    <input
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => handleSettingChange("general", "supportEmail", e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Timezone</label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleSettingChange("general", "timezone", e.target.value)}
                      className="form-select"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => handleSettingChange("general", "language", e.target.value)}
                      className="form-select"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Site Description</label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => handleSettingChange("general", "siteDescription", e.target.value)}
                    className="form-textarea"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.general.maintenanceMode}
                      onChange={(e) => handleSettingChange("general", "maintenanceMode", e.target.checked)}
                    />
                    <span className="checkbox-text">Enable Maintenance Mode</span>
                  </label>
                  <small className="form-help">When enabled, only administrators can access the site</small>
                </div>
              </div>
            )}

            {activeTab === "platform" && (
              <div className="settings-section">
                <h2>Platform Settings</h2>
                <div className="settings-grid">
                  <div className="form-group">
                    <label className="form-label">Max File Upload Size (MB)</label>
                    <input
                      type="number"
                      value={settings.platform.maxFileUploadSize}
                      onChange={(e) => handleSettingChange("platform", "maxFileUploadSize", parseInt(e.target.value))}
                      className="form-input"
                      min="1"
                      max="100"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.platform.sessionTimeout}
                      onChange={(e) => handleSettingChange("platform", "sessionTimeout", parseInt(e.target.value))}
                      className="form-input"
                      min="5"
                      max="480"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max Login Attempts</label>
                    <input
                      type="number"
                      value={settings.platform.maxLoginAttempts}
                      onChange={(e) => handleSettingChange("platform", "maxLoginAttempts", parseInt(e.target.value))}
                      className="form-input"
                      min="3"
                      max="10"
                    />
                  </div>
                </div>

                <div className="checkbox-group">
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.platform.allowRegistration}
                        onChange={(e) => handleSettingChange("platform", "allowRegistration", e.target.checked)}
                      />
                      <span className="checkbox-text">Allow User Registration</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.platform.requireEmailVerification}
                        onChange={(e) => handleSettingChange("platform", "requireEmailVerification", e.target.checked)}
                      />
                      <span className="checkbox-text">Require Email Verification</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.platform.autoApproveInstructors}
                        onChange={(e) => handleSettingChange("platform", "autoApproveInstructors", e.target.checked)}
                      />
                      <span className="checkbox-text">Auto-approve Instructor Applications</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="settings-section">
                <h2>Payment Settings</h2>
                <div className="settings-grid">
                  <div className="form-group">
                    <label className="form-label">Currency</label>
                    <select
                      value={settings.payment.currency}
                      onChange={(e) => handleSettingChange("payment", "currency", e.target.value)}
                      className="form-select"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={settings.payment.taxRate * 100}
                      onChange={(e) => handleSettingChange("payment", "taxRate", parseFloat(e.target.value) / 100)}
                      className="form-input"
                      min="0"
                      max="50"
                      step="0.1"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Commission Rate (%)</label>
                    <input
                      type="number"
                      value={settings.payment.commissionRate * 100}
                      onChange={(e) => handleSettingChange("payment", "commissionRate", parseFloat(e.target.value) / 100)}
                      className="form-input"
                      min="0"
                      max="50"
                      step="0.1"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Minimum Payout ($)</label>
                    <input
                      type="number"
                      value={settings.payment.minimumPayout}
                      onChange={(e) => handleSettingChange("payment", "minimumPayout", parseInt(e.target.value))}
                      className="form-input"
                      min="10"
                      max="500"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Payout Schedule</label>
                    <select
                      value={settings.payment.payoutSchedule}
                      onChange={(e) => handleSettingChange("payment", "payoutSchedule", e.target.value)}
                      className="form-select"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                </div>

                <div className="payment-keys">
                  <h3>Stripe Configuration</h3>
                  <div className="form-group">
                    <label className="form-label">Stripe Publishable Key</label>
                    <input
                      type="text"
                      value={settings.payment.stripePublishableKey}
                      onChange={(e) => handleSettingChange("payment", "stripePublishableKey", e.target.value)}
                      className="form-input"
                      placeholder="pk_test_..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stripe Secret Key</label>
                    <input
                      type="password"
                      value={settings.payment.stripeSecretKey}
                      onChange={(e) => handleSettingChange("payment", "stripeSecretKey", e.target.value)}
                      className="form-input"
                      placeholder="sk_test_..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "email" && (
              <div className="settings-section">
                <h2>Email Settings</h2>
                <div className="settings-grid">
                  <div className="form-group">
                    <label className="form-label">SMTP Host</label>
                    <input
                      type="text"
                      value={settings.email.smtpHost}
                      onChange={(e) => handleSettingChange("email", "smtpHost", e.target.value)}
                      className="form-input"
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">SMTP Port</label>
                    <input
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => handleSettingChange("email", "smtpPort", parseInt(e.target.value))}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">SMTP Username</label>
                    <input
                      type="text"
                      value={settings.email.smtpUsername}
                      onChange={(e) => handleSettingChange("email", "smtpUsername", e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">SMTP Password</label>
                    <input
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) => handleSettingChange("email", "smtpPassword", e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">From Email</label>
                    <input
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => handleSettingChange("email", "fromEmail", e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">From Name</label>
                    <input
                      type="text"
                      value={settings.email.fromName}
                      onChange={(e) => handleSettingChange("email", "fromName", e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="email-test">
                  <h3>Test Email Configuration</h3>
                  <p>Send a test email to verify your SMTP settings</p>
                  <button className="btn btn-secondary">Send Test Email</button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="settings-section">
                <h2>Security Settings</h2>
                <div className="settings-grid">
                  <div className="form-group">
                    <label className="form-label">Password Minimum Length</label>
                    <input
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => handleSettingChange("security", "passwordMinLength", parseInt(e.target.value))}
                      className="form-input"
                      min="6"
                      max="20"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max API Requests per Hour</label>
                    <input
                      type="number"
                      value={settings.security.maxApiRequests}
                      onChange={(e) => handleSettingChange("security", "maxApiRequests", parseInt(e.target.value))}
                      className="form-input"
                      min="100"
                      max="10000"
                    />
                  </div>
                </div>

                <div className="checkbox-group">
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.security.enableTwoFactor}
                        onChange={(e) => handleSettingChange("security", "enableTwoFactor", e.target.checked)}
                      />
                      <span className="checkbox-text">Enable Two-Factor Authentication</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.security.requireSpecialChars}
                        onChange={(e) => handleSettingChange("security", "requireSpecialChars", e.target.checked)}
                      />
                      <span className="checkbox-text">Require Special Characters in Passwords</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.security.sessionSecure}
                        onChange={(e) => handleSettingChange("security", "sessionSecure", e.target.checked)}
                      />
                      <span className="checkbox-text">Secure Session Cookies</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.security.enableRateLimiting}
                        onChange={(e) => handleSettingChange("security", "enableRateLimiting", e.target.checked)}
                      />
                      <span className="checkbox-text">Enable Rate Limiting</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="settings-section">
                <h2>Notification Settings</h2>
                <div className="checkbox-group">
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleSettingChange("notifications", "emailNotifications", e.target.checked)}
                      />
                      <span className="checkbox-text">Enable Email Notifications</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushNotifications}
                        onChange={(e) => handleSettingChange("notifications", "pushNotifications", e.target.checked)}
                      />
                      <span className="checkbox-text">Enable Push Notifications</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsNotifications}
                        onChange={(e) => handleSettingChange("notifications", "smsNotifications", e.target.checked)}
                      />
                      <span className="checkbox-text">Enable SMS Notifications</span>
                    </label>
                  </div>
                </div>

                <h3>Admin Notifications</h3>
                <div className="checkbox-group">
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.notifications.newUserNotification}
                        onChange={(e) => handleSettingChange("notifications", "newUserNotification", e.target.checked)}
                      />
                      <span className="checkbox-text">New User Registration</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.notifications.newCourseNotification}
                        onChange={(e) => handleSettingChange("notifications", "newCourseNotification", e.target.checked)}
                      />
                      <span className="checkbox-text">New Course Published</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={settings.notifications.paymentNotification}
                        onChange={(e) => handleSettingChange("notifications", "paymentNotification", e.target.checked)}
                      />
                      <span className="checkbox-text">Payment Received</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Restore Data Modal */}
        {showModal && modalType === "restore" && (
          <Modal
            title="Restore Data"
            onClose={() => setShowModal(false)}
          >
            <div className="restore-modal">
              <p>Upload a backup file to restore platform data.</p>
              <div className="form-group">
                <label className="form-label">Select Backup File</label>
                <input
                  type="file"
                  accept=".json"
                  className="form-input"
                />
              </div>
              <div className="warning-message">
                <strong>Warning:</strong> This will overwrite existing data. Make sure to create a backup first.
              </div>
              <div className="modal-actions">
                <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button className="btn btn-danger">
                  Restore Data
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminSettings
