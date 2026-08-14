import { useState } from "react";
import { eventsRepository } from "@/repositories/eventsRepository";
import { roundsRepository } from "@/repositories/roundsRepository";
import { tracksRepository } from "@/repositories/tracksRepository";
import { MOCK_DEFAULT_CRITERIAS, templatesRepository } from "@/repositories/templatesRepository";
import { staffRepository } from "@/repositories/staffRepository";
import { EventEntity, RoundEntity, TrackEntity, TemplateEntity, TemplateCriteriaEntity, EventRoleInvitationEntity } from "@/models/entities";

export interface EventFormState {
  eventName: string;
  season: string;
  year: number;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  maxTeams: number;
  description: string;
}

export interface RoundFormState {
  id: string; // temporary client ID
  roundName: string;
  roundNumber: number;
  startDate: string;
  endDate: string;
  advancementRule: string; // e.g. "top 10", "percent 50", "minScore 7.0"
}

export interface TrackFormState {
  id: string; // temporary client ID
  roundId: string; // references round client ID or real ID
  trackName: string;
  templateId: string;
  description: string;
}

export interface TemplateCriteriaFormState {
  criteriaId: string;
  criterionName: string;
  description: string;
  weight: number;
  maxScore: number;
}

export interface StaffInviteFormState {
  id: string;
  email: string;
  trackId?: string;
  roleName: "Judge" | "Mentor";
  status: "Pending" | "Accepted" | "Rejected";
}

export function useCreateEventWizardViewModel() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Step 1 State: Event Basic Info
  const [eventData, setEventData] = useState<EventFormState>({
    eventName: "SEAL Hackathon 2026",
    season: "Mùa Hè",
    year: 2026,
    startDate: "2026-07-15",
    endDate: "2026-09-20",
    registrationStartDate: "2026-06-01",
    registrationEndDate: "2026-07-10",
    maxTeams: 50,
    description: "Đấu trường công nghệ dành cho sinh viên toàn quốc quy mô lớn nhất trong năm của SEAL.",
  });

  // Created Event Entity after Step 1 submit
  const [createdEvent, setCreatedEvent] = useState<EventEntity | null>(null);

  // Step 2 State: Rounds
  const [rounds, setRounds] = useState<RoundFormState[]>([
    {
      id: "tmp-r1",
      roundName: "Vòng loại",
      roundNumber: 1,
      startDate: "2026-07-15",
      endDate: "2026-08-10",
      advancementRule: "top 20",
    },
    {
      id: "tmp-r2",
      roundName: "Chung kết",
      roundNumber: 2,
      startDate: "2026-08-15",
      endDate: "2026-09-20",
      advancementRule: "minScore 7.5",
    },
  ]);

  // Step 3 State: Tracks
  const [tracks, setTracks] = useState<TrackFormState[]>([
    {
      id: "tmp-t1",
      roundId: "tmp-r1",
      trackName: "AI & Machine Learning",
      templateId: "tpl-default-ai",
      description: "Hạng mục phát triển mô hình & ứng dụng Trí tuệ nhân tạo",
    },
    {
      id: "tmp-t2",
      roundId: "tmp-r1",
      trackName: "Phát triển Web & Mobile",
      templateId: "tpl-default-web",
      description: "Hạng mục xây dựng giải pháp web hoàn chỉnh",
    },
  ]);

  // Step 4 State: Criteria & Template Config
  const [templateName, setTemplateName] = useState<string>("Mẫu Tiêu Chí Chuẩn SEAL 2026");
  const [criterias, setCriterias] = useState<TemplateCriteriaFormState[]>([
    {
      criteriaId: "crit-1",
      criterionName: "Tính đổi mới & sáng tạo (Innovation)",
      description: "Đánh giá mức độ độc đáo của giải pháp công nghệ.",
      weight: 30,
      maxScore: 10,
    },
    {
      criteriaId: "crit-2",
      criterionName: "Kiến trúc hệ thống & Code Quality",
      description: "Đánh giá thiết kế hệ thống, độ sạch của mã nguồn & khả năng mở rộng.",
      weight: 40,
      maxScore: 10,
    },
    {
      criteriaId: "crit-3",
      criterionName: "Trải nghiệm người dùng (UX/UI)",
      description: "Giao diện trực quan, mượt mà và dễ sử dụng.",
      weight: 15,
      maxScore: 10,
    },
    {
      criteriaId: "crit-4",
      criterionName: "Kỹ năng thuyết trình & Đô thị thực chiến",
      description: "Khả năng trình bày sản phẩm và trả lời phản biện.",
      weight: 15,
      maxScore: 10,
    },
  ]);

  // Step 5 State: Staff Assignments (Judges / Mentors)
  const [staffInvites, setStaffInvites] = useState<StaffInviteFormState[]>([
    {
      id: "stf-1",
      email: "judge.ai@fpt.edu.vn",
      trackId: "tmp-t1",
      roleName: "Judge",
      status: "Pending",
    },
    {
      id: "stf-2",
      email: "mentor.web@fpt.edu.vn",
      trackId: "tmp-t2",
      roleName: "Mentor",
      status: "Pending",
    },
  ]);

  // Total weight computed live
  const totalWeight = criterias.reduce((acc, item) => acc + (Number(item.weight) || 0), 0);
  const isValidWeight100 = Math.abs(totalWeight - 100) < 0.01;

  // Actions
  const handleUpdateEventField = (field: keyof EventFormState, value: any) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddRound = () => {
    const nextNumber = rounds.length + 1;
    setRounds((prev) => [
      ...prev,
      {
        id: `tmp-r${Date.now()}`,
        roundName: `Vòng ${nextNumber}`,
        roundNumber: nextNumber,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        advancementRule: "top 10",
      },
    ]);
  };

  const handleRemoveRound = (id: string) => {
    if (rounds.length <= 1) return;
    setRounds((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateRound = (id: string, field: keyof RoundFormState, value: any) => {
    setRounds((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleAddTrack = () => {
    const defaultRoundId = rounds[0]?.id || "tmp-r1";
    setTracks((prev) => [
      ...prev,
      {
        id: `tmp-t${Date.now()}`,
        roundId: defaultRoundId,
        trackName: "Hạng mục công nghệ mới",
        templateId: "tpl-default-ai",
        description: "",
      },
    ]);
  };

  const handleRemoveTrack = (id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTrack = (id: string, field: keyof TrackFormState, value: any) => {
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleAddCriteria = (criteriaObj?: Partial<TemplateCriteriaFormState>) => {
    setCriterias((prev) => [
      ...prev,
      {
        criteriaId: criteriaObj?.criteriaId || `crit-${Date.now()}`,
        criterionName: criteriaObj?.criterionName || "Tiêu chí chấm điểm mới",
        description: criteriaObj?.description || "",
        weight: criteriaObj?.weight || 10,
        maxScore: criteriaObj?.maxScore || 10,
      },
    ]);
  };

  const handleRemoveCriteria = (index: number) => {
    setCriterias((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateCriteria = (index: number, field: keyof TemplateCriteriaFormState, value: any) => {
    setCriterias((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: field === "weight" || field === "maxScore" ? Number(value) : value } : item))
    );
  };

  const handleAddStaffInvite = (email: string, roleName: "Judge" | "Mentor", trackId?: string) => {
    if (!email || !email.includes("@")) {
      setErrorMessage("Vui lòng nhập địa chỉ email hợp lệ!");
      return;
    }
    setStaffInvites((prev) => [
      ...prev,
      {
        id: `stf-${Date.now()}`,
        email,
        trackId,
        roleName,
        status: "Pending",
      },
    ]);
    setErrorMessage(null);
  };

  const handleRemoveStaffInvite = (id: string) => {
    setStaffInvites((prev) => prev.filter((s) => s.id !== id));
  };

  // Step Transition Handlers
  const handleNextStep = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation per step
    if (currentStep === 1) {
      if (!eventData.eventName.trim()) {
        setErrorMessage("Vui lòng nhập Tên sự kiện!");
        return;
      }
      if (new Date(eventData.startDate) > new Date(eventData.endDate)) {
        setErrorMessage("Ngày bắt đầu sự kiện phải diễn ra trước ngày kết thúc!");
        return;
      }
      if (!eventData.maxTeams || eventData.maxTeams <= 0) {
        setErrorMessage("Số lượng đội thi tối đa phải lớn hơn 0!");
        return;
      }
      // Call API create event
      setIsSubmitting(true);
      const res = await eventsRepository.createEvent(eventData);
      setIsSubmitting(false);
      if (res.success && res.data) {
        setCreatedEvent(res.data);
        setCurrentStep(2);
      } else {
        setErrorMessage(res.message || "Tạo sự kiện thất bại!");
      }
    } else if (currentStep === 2) {
      if (rounds.length === 0) {
        setErrorMessage("Sự kiện cần ít nhất 1 Vòng thi (Round)!");
        return;
      }
      const realEventId = (createdEvent as any)?.id || (createdEvent as any)?.Id || createdEvent?.EventId;
      if (!realEventId) {
        setErrorMessage("Vui lòng hoàn thành Bước 1 để khởi tạo Sự kiện trước!");
        return;
      }

      setIsSubmitting(true);
      try {
        for (const rnd of rounds) {
          await roundsRepository.createRound({
            eventId: realEventId,
            roundName: rnd.roundName,
            roundNumber: rnd.roundNumber,
            startDate: rnd.startDate,
            endDate: rnd.endDate,
            advancementRule: rnd.advancementRule,
          });
        }
        setCurrentStep(3);
      } catch {
        setErrorMessage("Lỗi khi khởi tạo danh sách Vòng thi!");
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep === 3) {
      if (tracks.length === 0) {
        setErrorMessage("Vui lòng cấu hình ít nhất 1 Hạng mục thi (Track)!");
        return;
      }
      const realEventId = (createdEvent as any)?.id || (createdEvent as any)?.Id || createdEvent?.EventId;

      setIsSubmitting(true);
      try {
        for (const trk of tracks) {
          await tracksRepository.createTrack({
            roundId: trk.roundId || "rnd-1",
            trackName: trk.trackName,
            description: trk.description,
          });
        }
        setCurrentStep(4);
      } catch {
        setErrorMessage("Lỗi khi khởi tạo Hạng mục thi (Track)!");
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep === 4) {
      if (!isValidWeight100) {
        setErrorMessage(`Tổng trọng số tiêu chí phải đạt ĐÚNG 100%! Hiện tại là ${totalWeight}%.`);
        return;
      }

      setIsSubmitting(true);
      try {
        const resTpl = await templatesRepository.createTemplate({
          templateName: templateName || "Mẫu Tiêu Chí Đánh Giá RBL Standard",
          description: "Mẫu tiêu chí tổng hợp 100% trọng số",
        });
        const templateId = (resTpl.data as any)?.id || (resTpl.data as any)?.Id || resTpl.data?.TemplateId || "tpl-1";
        for (const crit of criterias) {
          await templatesRepository.addCriteriaToTemplate({
            templateId,
            criteriaId: crit.criteriaId,
            weight: crit.weight,
            maxScore: crit.maxScore,
          });
        }
        setCurrentStep(5);
      } catch {
        setErrorMessage("Lỗi khi lưu Mẫu tiêu chí đánh giá RBL!");
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep === 5) {
      const realEventId = (createdEvent as any)?.id || (createdEvent as any)?.Id || createdEvent?.EventId;
      setIsSubmitting(true);
      try {
        for (const staff of staffInvites) {
          if (staff.roleName === "Judge") {
            await staffRepository.inviteJudge({
              eventId: realEventId || "ev-1",
              trackId: staff.trackId,
              email: staff.email,
            });
          } else {
            await staffRepository.inviteMentor({
              eventId: realEventId || "ev-1",
              trackId: staff.trackId,
              email: staff.email,
            });
          }
        }
        setSuccessMessage("Đã hoàn tất tạo và cấu hình sự kiện cùng nhân sự thành công!");
      } catch (err: any) {
        setErrorMessage("Có lỗi xảy ra khi phân công nhân sự.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setErrorMessage(null);
      setCurrentStep((prev) => prev - 1);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    isSubmitting,
    errorMessage,
    successMessage,
    eventData,
    createdEvent,
    rounds,
    tracks,
    templateName,
    setTemplateName,
    criterias,
    totalWeight,
    isValidWeight100,
    staffInvites,
    handleUpdateEventField,
    handleAddRound,
    handleRemoveRound,
    handleUpdateRound,
    handleAddTrack,
    handleRemoveTrack,
    handleUpdateTrack,
    handleAddCriteria,
    handleRemoveCriteria,
    handleUpdateCriteria,
    handleAddStaffInvite,
    handleRemoveStaffInvite,
    handleNextStep,
    handlePrevStep,
  };
}
