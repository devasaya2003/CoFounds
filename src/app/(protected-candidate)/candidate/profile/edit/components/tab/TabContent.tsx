import { TabsContent } from "@/components/ui/tabs";
import PersonalInfoForm from "../PersonalInfoForm";
import SkillsForm from "../SkillsForm";
import CertificateForm from "../CertificateForm";
import ProofOfWorkForm from "../ProofOfWorkForm";
import EducationForm from "../EducationForm";
import { FormManagementReturn } from "../../hooks/form";
import { UserProfile } from "../../api";
import { CertificateFormData, SkillsUpdatePayload } from "../types";
import { ProofOfWorkUpdatePayload } from "../proof-of-work/types";
import { EducationUpdatePayload } from "../education/types";
import ProjectForm from "../ProjectForm";
import { ProjectUpdatePayload } from "../project/types";

interface TabContentProps {
  formManagement: FormManagementReturn;
  profileData: UserProfile;
  renderJsonData: (data: unknown) => React.ReactElement;
  handleSkillsData: (data: SkillsUpdatePayload) => void;
  handleCertificateData: (data: CertificateFormData) => void;
  handleProofOfWorkChange: (hasChanges: boolean) => void;
  handleProofOfWorkData: (data: { proofOfWorkUpdateData: ProofOfWorkUpdatePayload }) => void;
  handleEducationChange: (hasChanges: boolean) => void;
  handleEducationData: (data: { educationUpdateData: EducationUpdatePayload }) => void;
  handleProjectChange: (hasChanges: boolean) => void;
  handleProjectData: (data: { projectsUpdateData: ProjectUpdatePayload }) => void;
}

export default function TabContent({
  formManagement,
  profileData,
  renderJsonData,
  handleSkillsData,
  handleCertificateData,
  handleProofOfWorkChange,
  handleProofOfWorkData,
  handleEducationChange,
  handleEducationData,
  handleProjectChange,
  handleProjectData
}: TabContentProps) {
  const {
    personalFormRef,
    skillsFormRef,
    certificateFormRef,
    proofOfWorkFormRef,
    educationFormRef,
    projectFormRef,
    handlePersonalInfoChange,
    handlePersonalInfoData,
    handleSkillsChange,
    handleCertificateChange,
    handleProofOfWorkChange: formProofOfWorkChange,
    handleProofOfWorkData: formProofOfWorkData,
    handleEducationChange: formEducationChange,
    handleEducationData: formEducationData
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
        <EducationForm
          ref={educationFormRef}
          profile={profileData}
          onChange={formEducationChange}
          onSaveData={formEducationData}
        />
      </TabsContent>

      <TabsContent value="projects">
        <ProjectForm
          ref={projectFormRef}
          profile={profileData}
          onChange={handleProjectChange}
          onSaveData={handleProjectData}
        />
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
          onChange={formProofOfWorkChange}
          onSaveData={formProofOfWorkData}
        />
      </TabsContent>
    </>
  );
}