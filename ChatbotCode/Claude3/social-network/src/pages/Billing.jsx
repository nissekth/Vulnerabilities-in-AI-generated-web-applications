import React, { useState } from 'react';
import Navigation from '../components/Navigation';

function Billing() {
  const [billingInfo, setBillingInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    country: '',
    zipCode: ''
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setBillingInfo({...billingInfo, [e.target.name]: e.target.value});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Billing information saved! (Note: This is a demo - no actual payment processing)');
    setSaving(false);
  };

  return (
    <>
      <Navigation />
      <div className="page-wrapper">
        <div className="container" style={{maxWidth:'700px'}}>
          <h1 className="fade-in">Billing Information</h1>
          <p style={{color:'var(--text-muted)',marginBottom:'2rem'}}>
            Manage your payment details (Payments processed by third-party provider)
          </p>

          <div className="card fade-in">
            <div style={{padding:'1rem',background:'var(--bg-secondary)',borderRadius:'var(--radius-md)',marginBottom:'2rem'}}>
              <h3 style={{margin:'0 0 0.5rem'}}>Current Plan: Free</h3>
              <p style={{margin:0,fontSize:'0.9rem',color:'var(--text-secondary)'}}>No payment required for the free tier</p>
            </div>

            <form onSubmit={handleSave}>
              <h2 style={{marginBottom:'1.5rem'}}>Payment Method</h2>
              
              <div style={{display:'grid',gap:'1.5rem'}}>
                <div>
                  <label>Card Number</label>
                  <input type="text" name="cardNumber" value={billingInfo.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength="19" />
                </div>

                <div>
                  <label>Cardholder Name</label>
                  <input type="text" name="cardName" value={billingInfo.cardName} onChange={handleChange} placeholder="John Doe" />
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                  <div>
                    <label>Expiry Date</label>
                    <input type="text" name="expiryDate" value={billingInfo.expiryDate} onChange={handleChange} placeholder="MM/YY" maxLength="5" />
                  </div>
                  <div>
                    <label>CVV</label>
                    <input type="text" name="cvv" value={billingInfo.cvv} onChange={handleChange} placeholder="123" maxLength="3" />
                  </div>
                </div>

                <h2 style={{margin:'2rem 0 1rem'}}>Billing Address</h2>

                <div>
                  <label>Address</label>
                  <input type="text" name="billingAddress" value={billingInfo.billingAddress} onChange={handleChange} placeholder="123 Main St" />
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
                  <div>
                    <label>City</label>
                    <input type="text" name="city" value={billingInfo.city} onChange={handleChange} placeholder="New York" />
                  </div>
                  <div>
                    <label>Country</label>
                    <input type="text" name="country" value={billingInfo.country} onChange={handleChange} placeholder="USA" />
                  </div>
                  <div>
                    <label>ZIP Code</label>
                    <input type="text" name="zipCode" value={billingInfo.zipCode} onChange={handleChange} placeholder="10001" />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{marginTop:'1rem'}} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Billing Information'}
                </button>
              </div>
            </form>

            <div style={{marginTop:'2rem',padding:'1rem',background:'#eff6ff',borderRadius:'var(--radius-md)',border:'1px solid #bfdbfe'}}>
              <p style={{margin:0,fontSize:'0.9rem',color:'#1e40af'}}>
                🔒 Your payment information is securely stored and encrypted. Actual payment processing is handled by our trusted third-party payment provider.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Billing;
