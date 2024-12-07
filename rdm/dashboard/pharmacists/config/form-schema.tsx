import * as yup from 'yup';

export const PHARMACISTS_SCHEMA = yup.object().shape({
  brandName: yup.string().required(),
  name: yup.string().required(),
  description: yup.string().required(),
  startDate: yup.string().required(),
  endDate: yup.string().required(),
  phase: yup.string().required(),
  sponsor: yup.string().required(),
  location: yup.string().required(),
  targetPopulation: yup.string().required(),
  termsAndConditions: yup.string().required(),
  pharmaceuticals: yup.string().required()
});
