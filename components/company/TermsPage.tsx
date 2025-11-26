import React from 'react';
import PageHeader from '../common/PageHeader';

const TermsPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Terms of Service" subtitle={`Effective Date: ${new Date().toLocaleDateString()}`} />
      
      <div className="container mx-auto px-6 py-16">
        <div className="prose lg:prose-lg max-w-4xl mx-auto">
          <h2>1. Agreement to Terms</h2>
          <p>
            By using our Services, you agree to be bound by these Terms. If you do not agree to be bound by these Terms, do not use the Services.
          </p>

          <h2>2. Your Account</h2>
          <p>
            You may be required to create an account to use some of our Services. You are responsible for safeguarding your account, so use a strong password and limit its use to this account. We cannot and will not be liable for any loss or damage arising from your failure to comply with the above.
          </p>
          
          <h2>3. Using the Services</h2>
          <p>
            You may use the Services only if you can form a binding contract with ChemXGen, and only in compliance with these Terms and all applicable laws. When you create your ChemXGen account, you must provide us with accurate and complete information. Any use or access by anyone under the age of 13 is prohibited.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            The Services and their original content, features, and functionality are and will remain the exclusive property of ChemXGen and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of ChemXGen.
          </p>

          <h2>5. User Content</h2>
          <p>
            You are responsible for your use of the Services and for any content you provide, including compliance with applicable laws, rules, and regulations. By submitting, posting or displaying content on or through the Services, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display and distribute such content in any and all media or distribution methods.
          </p>
          
          <h2>6. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Services immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not to a breach of the Terms.
          </p>
          
          <h2>7. Limitation of Liability</h2>
          <p>
            IN NO EVENT SHALL CHEMXGEN, NOR ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIates, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the company is established, without regard to its conflict of law provisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
