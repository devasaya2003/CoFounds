import { TabsContent } from "@/components/ui/tabs";
import PersonalInfoForm from "../PersonalInfoForm";
import SkillsForm from "../SkillsForm";
import CertificateForm from "../CertificateForm";
import ProofOfWorkForm from "../ProofOfWorkForm";
import { FormManagementReturn } from "../../hooks/form";
import { UserProfile } from "../../api";
import { CertificateFormData, SkillsUpdatePayload } from "../types";
import { ProofOfWorkUpdatePayload } from "../proof-of-work/types";

interface TabContentProps {
  formManagement: FormManagementReturn;
  profileData: UserProfile;
  renderJsonData: (data: unknown) => React.ReactElement;
  handleSkillsData: (data: SkillsUpdatePayload) => void;
  handleCertificateData: (data: CertificateFormData) => void;
  handleProofOfWorkChange: (hasChanges: boolean) => void;
  handleProofOfWorkData: (data: { proofOfWorkUpdateData: ProofOfWorkUpdatePayload }) => void;
}

export default function TabContent({
  formManagement,
  profileData,
  renderJsonData,
  handleSkillsData,
  handleCertificateData
}: TabContentProps) {
  const {
    personalFormRef,
    skillsFormRef,
    certificateFormRef,
    proofOfWorkFormRef,
    handlePersonalInfoChange,
    handlePersonalInfoData,
    handleSkillsChange,
    handleCertificateChange,
    handleProofOfWorkChange,
    handleProofOfWorkData
  } = formManagement;

  return (
    <>
      <TabsContent value="personal-info">
        <PersonalInfoForm
          ref={personalFormRef}
          profile={profileData}
          onChange={handlePersonalInfoChange}
          onSaveData={handlePersonalInfoData}
          key={`personal-info-${JSON.stringify(profileData)}`}
        />
      </TabsContent>

      <TabsContent value="skills">
        <SkillsForm
          ref={skillsFormRef}
          profile={profileData}
          onChange={handleSkillsChange}
          onSaveData={handleSkillsData}
          key={`skills-${JSON.stringify(profileData.skillset)}`}
        />
      </TabsContent>

      <TabsContent value="education">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Education Data</h2>
          <p className="text-gray-500 mb-4">Raw JSON data from the API - will be replaced with forms later</p>
          {renderJsonData(profileData.education)}
        </div>
      </TabsContent>

      <TabsContent value="projects">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Projects Data</h2>
          <p className="text-gray-500 mb-4">Raw JSON data from the API - will be replaced with forms later</p>
          {renderJsonData(profileData.projects)}
        </div>
      </TabsContent>

      <TabsContent value="certificates" className="py-6 space-y-6">
        <CertificateForm
          ref={certificateFormRef}
          profile={profileData}
          onChange={handleCertificateChange}
          onSaveData={handleCertificateData}
        />
      </TabsContent>

      <TabsContent value="proof-of-work">
        <ProofOfWorkForm
          ref={proofOfWorkFormRef}
          profile={profileData}
          onChange={handleProofOfWorkChange}
          onSaveData={handleProofOfWorkData}
        />
      </TabsContent>
    </>
  );
}