'use client';

import ModuleHeader from '@/components/module-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Formik, Form, Field } from 'formik';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import Select from 'react-select';
import { useMoleculesContext } from '@/lib/providers/drugs.context';
import { Textarea } from '@/components/ui/textarea';
import * as Yup from 'yup';
import { useToast } from '@/hooks/use-toast';
import { useDrugAdversesContext } from '@/lib/providers/drug-adverses.context';
import { useLocalStorage } from '@/hooks/use-local-storage';

const DRUG_ADVERSE_FORM_SCHEMA = Yup.object().shape({
  drugName: Yup.string().required('Drug name is required'),
  dateOfBirth: Yup.date().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  patientFirstName: Yup.string().required('First name is required'),
  patientLastName: Yup.string().required('Last name is required'),
  medicationStartDate: Yup.date().required('Medication start date is required'),
  reactionStartDate: Yup.date().required('Reaction start date is required'),
  severity: Yup.string().required('Severity is required'),
  additionalNotes: Yup.string(),
  adverseReaction: Yup.string().required('Adverse reaction is required')
});

export default function ReportAdverseForm() {
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
  const { molecules } = useMoleculesContext();
  const { AddDrugAdverseHandler } = useDrugAdversesContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useLocalStorage('user', {});
  const { toast } = useToast();

  const initialValues = {
    drugName: '',
    dateOfBirth: '',
    gender: '',
    patientFirstName: '',
    patientLastName: '',
    medicationStartDate: '',
    reactionStartDate: '',
    severity: '',
    additionalNotes: '',
    reporter: user?.uid,
    adverseReaction: ''
  };

  async function onSubmit(values) {
    try {
      setIsLoading(true);
      const res = await AddDrugAdverseHandler({
        ...values
      });

      setIsLoading(false);
      toast({
        title: 'Successfully created adverse.'
      });
      router.push('/dashboard');
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Failed to create adverse.'
      });
    }
  }

  const moleculesOptions =
    molecules?.map((item: any) => ({
      value: item.id,
      label: item.drug_name || item.name
    })) || [];

  return (
    <div className="space-y-12">
      <ModuleHeader heading="Report Drug Adverse" />
      <Card className="bg-white px-3 py-8">
        <CardContent>
          <Formik
            initialValues={initialValues}
            // validationSchema={DRUG_ADVERSE_FORM_SCHEMA}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <Label>Drug Name</Label>

                    <Input
                      placeholder="drugName"
                      name="drugName"
                      disabled={action === 'view'}
                    />
                  </div>

                  <div>
                    <Label>Gender</Label>
                    <Input
                      name="gender"
                      placeholder="gender"
                      disabled={action === 'view'}
                    />
                  </div>
                  <div>
                    <Label>Patient First Name</Label>
                    <Input
                      placeholder="First Name"
                      name="patientFirstName"
                      disabled={action === 'view'}
                    />
                  </div>
                  <div>
                    <Label>Patient Last Name</Label>
                    <Input
                      placeholder="Last Name"
                      disabled={action === 'view'}
                      name="patientLastName"
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>

                    <Input
                      name="dateOfBirth"
                      disabled={action === 'view'}
                      placeholder="dateOfBirth"
                    />
                  </div>
                  <div>
                    <Label>When did you Start the medication</Label>
                    <Input
                      name="medicationStartDate"
                      disabled={action === 'view'}
                      placeholder="medicationStartDate"
                    />
                  </div>
                  <div>
                    <Label>When did this Reaction Start</Label>

                    <Input
                      name="reactionStartDate"
                      disabled={action === 'view'}
                      placeholder="reactionStartDate"
                    />
                  </div>
                  <div>
                    <Label>Severity of reaction</Label>

                    <Input
                      name="severity"
                      disabled={action === 'view'}
                      placeholder="severity"
                    />
                  </div>
                  <div>
                    <Label>Adverse Reaction</Label>

                    <Input
                      name="adverseReaction"
                      disabled={action === 'view'}
                      placeholder="adverseReaction"
                    />
                  </div>
                  <div>
                    <Label>Additional Notes</Label>

                    <Input
                      placeholder="additionalNotes"
                      disabled={action === 'view'}
                      name="additionalNotes"
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="text-white"
                  >
                    {isLoading ? (
                      <span className="flex flex-row items-center">
                        Loading...
                      </span>
                    ) : (
                      'Report'
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
