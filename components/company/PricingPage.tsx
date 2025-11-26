
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../common/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { SubscriptionTier } from '../../types';
import { CheckIcon } from '../icons/CheckIcon';

const plans = [
    {
        name: SubscriptionTier.INDIVIDUAL,
        price: '$199',
        priceUnit: '/month',
        description: 'For individual researchers and academics.',
        features: [
            'Up to 10 active projects',
            'Core AI prediction modules',
            'Community support',
            '1,000 AI credits/month',
        ],
        ctaText: 'Choose Individual',
    },
    {
        name: SubscriptionTier.TEAM,
        price: '$999',
        priceUnit: '/month',
        description: 'For small labs and research teams.',
        features: [
            'Up to 50 active projects',
            'All Individual features',
            'Team collaboration tools',
            'Advanced AI modules (synthesis, toxicology)',
            'Priority email support',
            '5,000 AI credits/month',
        ],
        ctaText: 'Choose Team',
        popular: true,
    },
    {
        name: SubscriptionTier.ENTERPRISE,
        price: 'Custom',
        priceUnit: '',
        description: 'For large organizations and custom needs.',
        features: [
            'Unlimited projects & users',
            'All Team features',
            'On-premise deployment option',
            'Custom model fine-tuning',
            'Dedicated account manager & support',
            'Volume-based credit pricing',
        ],
        ctaText: 'Contact Sales',
    }
];

const faqs = [
    {
        question: "Is there a free trial available?",
        answer: "We currently do not offer a public free trial. However, we do provide personalized demos for our Team and Enterprise plans. Please contact our sales team to schedule one."
    },
    {
        question: "Can I change my plan later?",
        answer: "Yes, you can upgrade or downgrade your plan at any time from your billing portal. Changes will be pro-rated for the current billing cycle."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, including Visa, Mastercard, and American Express. For Enterprise plans, we also support invoicing and bank transfers."
    },
    {
        question: "What are AI credits?",
        answer: "AI credits are used to perform computationally intensive tasks like generating novel molecules or running complex synthesis predictions. Each plan comes with a monthly allowance, and you can purchase additional credits if needed."
    }
];

const PricingPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCtaClick = (planName: SubscriptionTier) => {
        if (planName === SubscriptionTier.ENTERPRISE) {
            navigate('/contact');
        } else {
            if (user) {
                navigate('/app/billing');
            } else {
                navigate('/login');
            }
        }
    };

    return (
        <div className="bg-gray-50 animate-fade-in">
            <PageHeader
                title="Find the Right Plan for You"
                subtitle="Transparent pricing for teams of all sizes. Power your research with the leading platform in molecular AI."
            />

            <section className="container mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-3 gap-8 items-center">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`relative bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 ${plan.popular ? 'lg:-translate-y-4 border-4 border-molecular-teal' : 'border border-gray-200'}`}>
                            {plan.popular && (
                                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                    <span className="bg-molecular-teal text-deep-blue px-4 py-1 rounded-full text-sm font-semibold uppercase">Most Popular</span>
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-deep-blue text-center">{plan.name}</h3>
                            <p className="text-gray-500 text-center mt-2 h-10">{plan.description}</p>
                            <div className="mt-6 text-center">
                                <span className="text-5xl font-display font-black text-deep-blue">{plan.price}</span>
                                <span className="text-gray-500 font-medium">{plan.priceUnit}</span>
                            </div>
                            <ul className="mt-8 space-y-4">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckIcon className="w-5 h-5 text-molecular-teal mr-3 flex-shrink-0 mt-1" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleCtaClick(plan.name)}
                                className={`w-full mt-10 py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${plan.popular ? 'bg-molecular-teal text-deep-blue hover:opacity-90' : 'bg-deep-blue text-white hover:bg-opacity-90'}`}
                            >
                                {plan.ctaText}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
            
            <section className="bg-white py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-display font-bold text-deep-blue">Frequently Asked Questions</h2>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b pb-4">
                                <h3 className="font-semibold text-lg text-deep-blue">{faq.question}</h3>
                                <p className="mt-2 text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PricingPage;
