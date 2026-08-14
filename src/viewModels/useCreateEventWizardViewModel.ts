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
  scoringStartDate?: string;
  scoringEndDate?: string;
  appealStartDate?: string;
  appealEndDate?: string;
}

export interface TrackFormState {
  id: string; // temporary client ID
  eventId?: string;
  trackName: string;
  templateId: string;
  description: string;
  startDate?: string;
  endDate?: string;
  scoringStartDate?: string;
  scoringEndDate?: string;
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
      advancementRule: "top:20",
    },
    {
      id: "tmp-r2",
      roundName: "Chung kết",
      roundNumber: 2,
      startDate: "2026-08-15",
      endDate: "2026-09-20",
      advancementRule: "minscore:7.5",
    },
  ]);

  // Step 3 State: Tracks
  const [tracks, setTracks] = useState<TrackFormState[]>([
    {
      id: "tmp-t1",
      trackName: "AI & Machine Learning",
      templateId: "__custom__",
      description: "Hạng mục phát triển mô hình & ứng dụng Trí tuệ nhân tạo",
    },
    {
      id: "tmp-t2",
      trackName: "Phát triển Web & Mobile",
      templateId: "__custom__",
      description: "Hạng mục xây dựng giải pháp web hoàn chỉnh",
    },
  ]);

  // Step 4 State: Criteria & Template Config
  const [templateName, setTemplateName] = useState<string>("");
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
        advancementRule: "top:10",
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
        templateId: "__custom__",
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
      // Step 1: Check if Event is already created from previous attempt
      const rawObj = createdEvent as any;
      const existingEventId = rawObj?.id || rawObj?.Id || rawObj?.eventId || rawObj?.EventId || rawObj?.data?.id || rawObj?.data?.Id;
      if (existingEventId) {
        setCurrentStep(2);
        return;
      }

      // Call API create event
      setIsSubmitting(true);
      try {
        const res = await eventsRepository.createEvent(eventData);
        setIsSubmitting(false);
        const createdObj = res?.data || res;
        const realEventId = createdObj?.id || createdObj?.Id || createdObj?.eventId || createdObj?.EventId;

        if (res && res.success !== false && realEventId) {
          setCreatedEvent(createdObj);
          setCurrentStep(2);
        } else {
          setErrorMessage(res?.message || "Tạo sự kiện thất bại. Vui lòng kiểm tra lại thông tin!");
        }
      } catch (err: any) {
        setIsSubmitting(false);
        setErrorMessage(err?.response?.data?.message || err?.message || "Tạo sự kiện thất bại. Không thể kết nối máy chủ.");
      }
    } else if (currentStep === 2) {
      if (rounds.length === 0) {
        setErrorMessage("Sự kiện cần ít nhất 1 Vòng thi (Round)!");
        return;
      }
      const rawObj = createdEvent as any;
      const realEventId = rawObj?.id || rawObj?.Id || rawObj?.eventId || rawObj?.EventId || rawObj?.data?.id || rawObj?.data?.Id || rawObj?.data?.eventId || rawObj?.data?.EventId;
      if (!realEventId) {
        setErrorMessage("Vui lòng hoàn thành Bước 1 để khởi tạo Sự kiện trước!");
        return;
      }

      // Check if rounds are already created
      const existingRounds: any[] = (window as any).__createdRoundsList__ || [];
      if (existingRounds.length > 0 && existingRounds.length === rounds.length) {
        setCurrentStep(3);
        return;
      }

      setIsSubmitting(true);
      try {
        const createdRounds: any[] = [];
        for (const rnd of rounds) {
          // If this specific round was already created, skip creating again
          const alreadyCreated = existingRounds.find((r: any) => r.clientRoundId === rnd.id || r.roundNumber === rnd.roundNumber);
          if (alreadyCreated) {
            createdRounds.push(alreadyCreated);
            continue;
          }

          const res = await roundsRepository.createRound({
            eventId: realEventId,
            roundName: rnd.roundName,
            roundNumber: rnd.roundNumber,
            startDate: rnd.startDate,
            endDate: rnd.endDate,
            advancementRule: rnd.advancementRule,
            scoringStartDate: rnd.scoringStartDate,
            scoringEndDate: rnd.scoringEndDate,
            appealStartDate: rnd.appealStartDate,
            appealEndDate: rnd.appealEndDate,
          });
          if (res?.data) {
            createdRounds.push({ ...res.data, clientRoundId: rnd.id, roundNumber: rnd.roundNumber });
          }
        }
        (window as any).__createdRoundsList__ = createdRounds;
        setCurrentStep(3);
      } catch (err: any) {
        setErrorMessage(err?.response?.data?.message || "Lỗi khi khởi tạo danh sách Vòng thi!");
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep === 3) {
      if (tracks.length === 0) {
        setErrorMessage("Vui lòng cấu hình ít nhất 1 Hạng mục thi (Track)!");
        return;
      }
      const realEventId = (createdEvent as any)?.id || (createdEvent as any)?.Id || createdEvent?.EventId || (createdEvent as any)?.data?.id;
      if (!realEventId) {
        setErrorMessage("Thiếu mã sự kiện (EventId). Vui lòng quay lại Bước 1!");
        return;
      }

      // Check if tracks are already created
      const existingTracks: any[] = (window as any).__createdTrackList__ || [];
      if (existingTracks.length > 0 && existingTracks.length === tracks.length) {
        setCurrentStep(4);
        return;
      }

      setIsSubmitting(true);
      try {
        const createdTrackList: any[] = [];
        for (const trk of tracks) {
          const alreadyCreated = existingTracks.find((t: any) => t.clientTrackId === trk.id);
          if (alreadyCreated) {
            createdTrackList.push(alreadyCreated);
            continue;
          }

          const payload: any = {
            eventId: realEventId,
            trackName: trk.trackName,
            description: trk.description,
            templateId: trk.templateId !== "__custom__" ? trk.templateId : undefined,
          };
          if (trk.startDate) payload.startDate = trk.startDate;
          if (trk.endDate) payload.endDate = trk.endDate;
          if (trk.scoringStartDate) payload.scoringStartDate = trk.scoringStartDate;
          if (trk.scoringEndDate) payload.scoringEndDate = trk.scoringEndDate;

          const resTrack = await tracksRepository.createTrack(payload);
          const trackObj: any = resTrack?.data || resTrack;
          if (trackObj) {
            createdTrackList.push({
              clientTrackId: trk.id,
              realTrackId: trackObj.id || trackObj.Id || trackObj.trackId || trackObj.TrackId,
              templateId: trk.templateId,
            });
          }
        }
        (window as any).__createdTrackList__ = createdTrackList;
        setCurrentStep(4);
      } catch (err: any) {
        setErrorMessage(err?.response?.data?.message || "Lỗi khi khởi tạo Hạng mục thi (Track)!");
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
          templateName: templateName || "Mẫu Tiêu Chí Chuẩn SEAL 2026",
          description: "Mẫu tiêu chí tổng hợp 100% trọng số",
        });
        const templateId = (resTpl.data as any)?.id || (resTpl.data as any)?.Id || resTpl.data?.TemplateId;
        if (templateId) {
          for (const crit of criterias) {
            await templatesRepository.addCriteriaToTemplate({
              templateId,
              criteriaId: crit.criteriaId,
              weight: crit.weight,
              maxScore: crit.maxScore,
            });
          }

          // Assign newly created template to tracks that chose __custom__
          const createdTrackList: any[] = (window as any).__createdTrackList__ || [];
          for (const item of createdTrackList) {
            if (item.templateId === "__custom__" && item.realTrackId) {
              await tracksRepository.assignTemplateToTrack(item.realTrackId, templateId);
            }
          }
        }
        setCurrentStep(5);
      } catch (err: any) {
        setErrorMessage(err?.response?.data?.message || "Lỗi khi lưu Mẫu tiêu chí đánh giá RBL!");
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep === 5) {
      const realEventId = (createdEvent as any)?.id || (createdEvent as any)?.Id || createdEvent?.EventId || (createdEvent as any)?.data?.id;
      if (!realEventId) {
        setErrorMessage("Thiếu mã sự kiện (EventId). Không thể gán nhân sự!");
        return;
      }
      setIsSubmitting(true);
      try {
        const createdTrackList: any[] = (window as any).__createdTrackList__ || [];
        for (const staff of staffInvites) {
          const targetTrackObj = createdTrackList.find((t) => t.clientTrackId === staff.trackId);
          const realTrackId = targetTrackObj?.realTrackId || staff.trackId;

          if (staff.roleName === "Judge") {
            await staffRepository.inviteJudge({
              eventId: realEventId,
              trackId: realTrackId,
              email: staff.email,
            });
          } else {
            await staffRepository.inviteMentor({
              eventId: realEventId,
              trackId: realTrackId,
              email: staff.email,
            });
          }
        }
        setSuccessMessage("Đã hoàn tất tạo và cấu hình sự kiện cùng nhân sự thành công!");
      } catch (err: any) {
        setErrorMessage(err?.response?.data?.message || "Có lỗi xảy ra khi phân công nhân sự.");
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
