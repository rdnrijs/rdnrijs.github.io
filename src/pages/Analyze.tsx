
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { analyzeRequirements, RequirementAnalysisResult, TokenUsage } from '@/utils/openAIService';
import { toast } from "sonner";
import RequestInput from '@/components/request/RequestInput';
import RequirementResults from '@/components/RequirementResults';
import APIKeyForm from '@/components/APIKeyForm';
import Layout from '@/components/Layout';
import { getSelectedProvider } from '@/utils/storageUtils';

const Analyze = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RequirementAnalysisResult | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [clientRequest, setClientRequest] = useState('');
  const [stakeholders, setStakeholders] = useState('');
  const [systems, setSystems] = useState('');
  const [companyContext, setCompanyContext] = useState('');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to properly format input data
  const formatInputData = (text: string): string => {
    // Ensure proper line breaks for API calls
    return text.replace(/\\n/g, '\n');
  };

  const handleSubmit = async (request: string, context: string, stakeholdersData: string, systemsData: string, companyContextData: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setClientRequest(request);
      setStakeholders(stakeholdersData);
      setSystems(systemsData);
      setCompanyContext(companyContextData);
      
      // Format data before sending to API
      const formattedRequest = formatInputData(request);
      const formattedContext = formatInputData(context);
      
      const response = await analyzeRequirements(formattedRequest, formattedContext);
      setResult(response.result);
      setTokenUsage(response.tokenUsage);
    } catch (error) {
      console.error('Error analyzing requirements:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error('Failed to analyze requirements. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiConfigured = () => {
    setShowApiConfig(false);
  };

  return (
    <Layout>
      <div className="py-8">
        {showApiConfig ? (
          <APIKeyForm 
            onConfigured={handleApiConfigured} 
            provider={getSelectedProvider() as 'openai' | 'google'}
          />
        ) : !result ? (
          <>
            <RequestInput onSubmit={handleSubmit} isLoading={isLoading} />
            {error && (
              <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
                <h3 className="font-semibold">Error analyzing requirements:</h3>
                <p className="mt-1">{error}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6">
              <button onClick={() => setResult(null)} className="px-4 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors">
                ← Back to Input
              </button>
            </div>
            
            <RequirementResults result={result} tokenUsage={tokenUsage!} clientRequest={clientRequest} stakeholders={stakeholders} systems={systems} companyContext={companyContext} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Analyze;
