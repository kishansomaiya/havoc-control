import { object, string } from 'yup';

export const renameAnalysisFormSchema = object({
    perilName: string().trim().required('Perils result-set name cannot be empty'),
    scoreName: string().trim().required('Scores result-set name cannot be empty'),
    economicImpactName: string().trim().required('Economic Impacts result-set name cannot be empty'),
    meshName: string().trim().required('Flood Mesh result-set name cannot be empty'),
    disclosureAnalysisName: string().trim().required('Disclosure result-set name cannot be empty'),
});
