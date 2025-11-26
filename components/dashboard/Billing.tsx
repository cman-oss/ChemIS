import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SubscriptionTier } from '../../types';
import { redirectToCheckout, redirectToBillingPortal } from '../../services/stripeService';
import { Link } from 'react-router-dom';

const plans = [
    {
        name: SubscriptionTier.INDIVIDUAL,
        priceId: 'price_1PLaZtRvxH2922x9aBcDeFgH', // Placeholder Price ID
        price: '$199',
        priceUnit: '/month',
        features: ['Up to 10 projects', 'No project deletion', 'Basic AI features'],
    },
    {
        name: SubscriptionTier.TEAM,
        priceId: 'price_1PLaZtRvxH2922x9iJkLmNoP', // Placeholder Price ID
        price: '$999',
        priceUnit: '/month',
        features: ['Up to 50 projects', 'Team collaboration', 'Advanced AI modules'],
    },
    {
        name: SubscriptionTier.ENTERPRISE,
        priceId: null, // No direct checkout for Enterprise
        price: 'Custom',
        priceUnit: '',
        features: ['Unlimited projects', 'Custom AI models', 'Early access features', 'Project deletion allowed'],
    }
];

const PlanCard: React.FC<{
    plan: typeof plans[0],
    onSelectPlan: (priceId: string) => void,
    loadingPriceId: string | null
}> = ({ plan, onSelectPlan, loadingPriceId }) => {
    const { user } = useAuth();
    const isCurrent = user?.subscription_tier === plan.name;
    const isLoading = loadingPriceId === plan.priceId;

    const renderButton = () => {
        if (isCurrent) {
            return (
                <button className="w-full mt-auto bg-dark-border text-dark-text-secondary font-semibold py-2 rounded-md cursor-default">
                    Current Plan
                </button>
            );
        }
        if (plan.name === SubscriptionTier.ENTERPRISE) {
            return (
                <Link to="/contact" className="w-full text-center mt-auto bg-accent-cyan text-dark-bg font-semibold py-2 rounded-md hover:opacity-90 transition-opacity">
                    Contact Sales
                </Link>
            );
        }
        return (
            <button 
                onClick={() => onSelectPlan(plan.priceId!)}
                disabled={isLoading}
                className="w-full mt-auto bg-accent-cyan text-dark-bg font-semibold py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
                {isLoading ? 'Redirecting...' : 'Upgrade Plan'}
            </button>
        );
    };
    
    return (
        <div className={`border rounded-lg p-6 flex flex-col ${isCurrent ? 'border-accent-cyan bg-dark-card' : 'border-dark-border bg-dark-bg'}`}>
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            <div className="my-4">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-dark-text-secondary">{plan.priceUnit}</span>
            </div>
            <ul className="space-y-2 text-dark-text mb-6 flex-1">
                {plan.features.map(f => <li key={f} className="flex items-center space-x-2">
                    <span className="text-accent-cyan">&#10003;</span>
                    <span>{f}</span>
                </li>)}
            </ul>
            {renderButton()}
        </div>
    );
};

const Billing: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState<{ portal: boolean; checkout: string | null }>({ portal: false, checkout: null });
    const [error, setError] = useState<string | null>(null);

    const handleManageSubscription = async () => {
        setError(null);
        setLoading(prev => ({ ...prev, portal: true }));
        try {
            await redirectToBillingPortal();
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(prev => ({ ...prev, portal: false }));
        }
    };

    const handleSelectPlan = async (priceId: string) => {
        setError(null);
        setLoading({ portal: false, checkout: priceId });
        try {
            await redirectToCheckout(priceId);
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
            setLoading({ portal: false, checkout: null });
        }
        // No need to set loading to false on success, as the page will redirect.
    };
    
    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Billing & Plans</h1>
            <p className="text-dark-text-secondary mb-8">Manage your subscription and billing details.</p>

            {error && (
                <div className="bg-red-900/50 border border-red-500/50 rounded-md text-red-300 text-sm p-4 mb-8 text-center">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Current Subscription</h2>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-dark-text">Your plan: <span className="font-bold text-accent-cyan">{user?.subscription_tier}</span></p>
                        <p className="text-sm text-dark-text-secondary mt-1">Manage your plan, view invoices, and update payment methods in the Stripe Portal.</p>
                    </div>
                    <button 
                        onClick={handleManageSubscription}
                        disabled={loading.portal}
                        className="bg-dark-border text-white font-semibold px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors disabled:opacity-50"
                    >
                        {loading.portal ? 'Opening...' : 'Manage in Stripe Portal'}
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {plans.map(p => (
                    <PlanCard 
                        key={p.name} 
                        plan={p} 
                        onSelectPlan={handleSelectPlan} 
                        loadingPriceId={loading.checkout}
                    />
                ))}
            </div>
        </div>
    );
};

export default Billing;
