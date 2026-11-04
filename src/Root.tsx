import React from 'react';
import { Composition } from 'remotion';
import { Video1_TOFU_37s } from './Video1_TOFU_37s';
import { Video1_TOFU_Poster } from './Video1_TOFU_Poster';
import { Video2_SapaMart, SAPA_DURATION } from './Video2_SapaMart';
import { Video3_Leaderboard, LEADERBOARD_DURATION } from './Video3_Leaderboard';
import { Video4_VIPClub, VIP_CLUB_DURATION } from './Video4_VIPClub';
import { Video4_Tutorial, TUTORIAL_DURATION } from './Video4_Tutorial';
import { Video5_CupVsBottle, CUP_VS_BOTTLE_DURATION } from './Video5_CupVsBottle';
import { Video6_ViralReel, VIRAL_REEL_DURATION } from './Video6_ViralReel';
import { CarouselSlide1, CarouselSlide2, CarouselSlide3, CarouselSlide4 } from './Post2_Carousel';
import { SteviaSlide1, SteviaSlide2, SteviaSlide3, SteviaSlide4 } from './Carousel_Stevia';
import { FounderSlide1, FounderSlide2, FounderSlide3, FounderSlide4 } from './Carousel_FounderStory';
import {
  SatDrop_Slide1, SatDrop_Slide2, SatDrop_Slide3, SatDrop_Slide4,
  SunReset_Slide1, SunReset_Slide2, SunReset_Slide3, SunReset_Slide4,
  DeepWork_Slide1, DeepWork_Slide2, DeepWork_Slide3, DeepWork_Slide4,
  Finance_Slide1, Finance_Slide2, Finance_Slide3, Finance_Slide4,
  Scarcity_Slide1, Scarcity_Slide2, Scarcity_Slide3, Scarcity_Slide4,
} from './Carousels_Scheduled';
import {
  BandungDelay_Slide1, BandungDelay_Slide2, BandungDelay_Slide3, BandungDelay_Slide4,
} from './Carousel_BandungDelay';
import { StoryClean, StoryRaw } from './Post3_Story';
import { StorySuperiorityClean, StorySuperiorityRaw } from './Post3_StorySuperiority';
import { Reel1_BlenderEfficiency, REEL_1_DURATION } from './Reel1_BlenderEfficiency';
import { Reel2_BlindTasteTest, REEL_2_DURATION } from './Reel2_BlindTasteTest';
import { Reel3_WorkplaceEnergy, REEL_3_DURATION } from './Reel3_WorkplaceEnergy';
import { Reel4_PriceGuess, REEL_4_DURATION } from './Reel4_PriceGuess';
import { Reel5_FounderAntiFactory, REEL_5_DURATION } from './Reel5_FounderAntiFactory';
import { Reel6_LaptopSpill, REEL_6_DURATION } from './Reel6_LaptopSpill';
import { Reel7_MythNoSugar, REEL_7_DURATION } from './Reel7_MythNoSugar';
import { Reel8_PureJapaneseMatcha, REEL_8_DURATION } from './Reel8_PureJapaneseMatcha';
import { Reel9_OatsideFormula, REEL_9_DURATION } from './Reel9_OatsideFormula';
import { Reel10_FridayNightBrewing, REEL_10_DURATION } from './Reel10_FridayNightBrewing';
import { Reel11_SteviaTruth, REEL_11_DURATION } from './Reel11_SteviaTruth';
import { Reel12_SapaMartComeback, REEL_12_DURATION } from './Reel12_SapaMartComeback';
import { Reel13_SaturdayCodLoop, REEL_13_DURATION } from './Reel13_SaturdayCodLoop';
import { Reel_AliveDemo, ALIVE_DEMO_DURATION } from './Reel_AliveDemo';
import { Compare_OptionA_Layered_32fps, OPTION_A_DURATION_32FPS } from './Compare_OptionA_Layered_32fps';
import { Compare_OptionC_ClassicTwos_32fps, OPTION_C_DURATION_32FPS } from './Compare_OptionC_ClassicTwos_32fps';
import { Real_32Frame_Motion, REAL_32_MOTION_DURATION } from './Real_32Frame_Motion';
import { Caleb_Omni_Ritual, CALEB_OMNI_DURATION } from './Caleb_Omni_Ritual';
import { Caleb_Puppet_Rig, CALEB_PUPPET_DURATION } from './Caleb_Puppet_Rig';
import { Scene5_Living_Room, SCENE5_LIVING_DURATION } from './Scene5_Living_Room';
import {
  Anatomi_Slide1, Anatomi_Slide2, Anatomi_Slide3, Anatomi_Slide4,
  GuideMenu_Slide1, GuideMenu_Slide2, GuideMenu_Slide3, GuideMenu_Slide4,
  Rutinitas_Slide1, Rutinitas_Slide2, Rutinitas_Slide3, Rutinitas_Slide4,
  BotolVsCup_Slide1, BotolVsCup_Slide2, BotolVsCup_Slide3, BotolVsCup_Slide4,
  PreorderChecklist_Slide1, PreorderChecklist_Slide2, PreorderChecklist_Slide3, PreorderChecklist_Slide4,
} from './Carousels_NewTen';
import { TestSceneRefined } from './TestSceneRefined';
import { TestCarouselSlideRefined } from './TestCarouselSlideRefined';
import {
  EditorialSlide1,
  EditorialSlide2,
  EditorialSlide3,
  EditorialSlide4,
  EditorialSlide5,
  EditorialSlide6,
  EditorialSlide7,
  EditorialSlide8,
} from './Carousels/CarouselEditorialEngine';
import {
  RevisedSlide1,
  RevisedSlide2,
  RevisedSlide3,
  RevisedSlide4,
  RevisedSlide5,
  RevisedSlide6,
  RevisedSlide7,
  RevisedSlide8,
} from './Carousels/CarouselRevisedLightStudio';
import { Reel14_ViralEngine, REEL_14_DURATION } from './Reel14_ViralEngine';
import { Reel15_RevisedSample, REEL_15_DURATION } from './Reel15_RevisedSample';
import { Reel16_WorkingStyleRevamp, REEL_16_DURATION } from './Reel16_WorkingStyleRevamp';
import { Reel17_Dynamic3PSomatic, REEL_17_DURATION } from './Reel17_Dynamic3PSomatic';
import { FreshReel_Cup50k, FRESH_CUP50K_DURATION } from './FreshReel_Cup50k';
import { Reel_Science8Bit_Somatic, SCIENCE8BIT_DURATION } from './Reel_Science8Bit_Somatic';


export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Video 6: Viral Reel - The 3 Signs Open Loop (30.83s = 925 frames) */}
      <Composition
        id="Video6-ViralReel"
        component={Video6_ViralReel}
        durationInFrames={VIRAL_REEL_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />

      {/* 5 Brand New Reels (100% Fresh Script, VO, Pixel Art & Animation) */}
      <Composition
        id="Reel1-BlenderEfficiency"
        component={Reel1_BlenderEfficiency}
        durationInFrames={REEL_1_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Reel2-BlindTasteTest"
        component={Reel2_BlindTasteTest}
        durationInFrames={REEL_2_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Reel3-WorkplaceEnergy"
        component={Reel3_WorkplaceEnergy}
        durationInFrames={REEL_3_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Reel4-PriceGuess"
        component={Reel4_PriceGuess}
        durationInFrames={REEL_4_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Reel5-FounderAntiFactory"
        component={Reel5_FounderAntiFactory}
        durationInFrames={REEL_5_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Reel6-LaptopSpill"
        component={Reel6_LaptopSpill}
        durationInFrames={REEL_6_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Reel7-MythNoSugar"
        component={Reel7_MythNoSugar}
        durationInFrames={REEL_7_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Reel8-PureJapaneseMatcha"
        component={Reel8_PureJapaneseMatcha}
        durationInFrames={REEL_8_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Reel9-OatsideFormula"
        component={Reel9_OatsideFormula}
        durationInFrames={REEL_9_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Reel10-FridayNightBrewing"
        component={Reel10_FridayNightBrewing}
        durationInFrames={REEL_10_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Reel11-SteviaTruth"
        component={Reel11_SteviaTruth}
        durationInFrames={REEL_11_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="LiraSapaMartComeback8Bit"
        component={Reel12_SapaMartComeback}
        durationInFrames={REEL_12_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Reel-AliveDemo"
        component={Reel_AliveDemo}
        durationInFrames={ALIVE_DEMO_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Compare-OptionA-32fps"
        component={Compare_OptionA_Layered_32fps}
        durationInFrames={OPTION_A_DURATION_32FPS}
        fps={32}
        width={1080}
        height={1440}
      />
      <Composition
        id="Compare-OptionC-32fps"
        component={Compare_OptionC_ClassicTwos_32fps}
        durationInFrames={OPTION_C_DURATION_32FPS}
        fps={32}
        width={1080}
        height={1440}
      />
      <Composition
        id="Real-32Frame-Motion"
        component={Real_32Frame_Motion}
        durationInFrames={REAL_32_MOTION_DURATION}
        fps={32}
        width={1080}
        height={1440}
      />
      <Composition
        id="Caleb-Omni-Ritual"
        component={Caleb_Omni_Ritual}
        durationInFrames={CALEB_OMNI_DURATION}
        fps={32}
        width={1080}
        height={1440}
      />
      <Composition
        id="Caleb-Puppet-Rig"
        component={Caleb_Puppet_Rig}
        durationInFrames={CALEB_PUPPET_DURATION}
        fps={32}
        width={1080}
        height={1440}
      />
      <Composition
        id="Scene5-Living-Room"
        component={Scene5_Living_Room}
        durationInFrames={SCENE5_LIVING_DURATION}
        fps={32}
        width={774}
        height={1024}
      />

      {/* 5 Brand New Carousels (20 Slides) */}
      {/* Carousel 11: Anatomi Botol Lira */}
      <Composition id="Carousel-Anatomi-1" component={Anatomi_Slide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Anatomi-2" component={Anatomi_Slide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Anatomi-3" component={Anatomi_Slide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Anatomi-4" component={Anatomi_Slide4} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Carousel 12: Guide Varian Menu Lira */}
      <Composition id="Carousel-GuideMenu-1" component={GuideMenu_Slide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-GuideMenu-2" component={GuideMenu_Slide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-GuideMenu-3" component={GuideMenu_Slide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-GuideMenu-4" component={GuideMenu_Slide4} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Carousel 13: 5 Rutinitas Mahasiswa & Coder */}
      <Composition id="Carousel-Rutinitas-1" component={Rutinitas_Slide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Rutinitas-2" component={Rutinitas_Slide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Rutinitas-3" component={Rutinitas_Slide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Rutinitas-4" component={Rutinitas_Slide4} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Carousel 14: Botol Siap Minum vs Cup Takeaway Kafe */}
      <Composition id="Carousel-BotolVsCup-1" component={BotolVsCup_Slide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-BotolVsCup-2" component={BotolVsCup_Slide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-BotolVsCup-3" component={BotolVsCup_Slide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-BotolVsCup-4" component={BotolVsCup_Slide4} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Carousel 15: Pre-Order Checklist Cara Amankan Batch */}
      <Composition id="Carousel-PreorderChecklist-1" component={PreorderChecklist_Slide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-PreorderChecklist-2" component={PreorderChecklist_Slide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-PreorderChecklist-3" component={PreorderChecklist_Slide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-PreorderChecklist-4" component={PreorderChecklist_Slide4} durationInFrames={30} fps={30} width={1080} height={1350} />
      {/* Test Demonstrations for User Verification */}
      <Composition
        id="Test-Scene-Refined"
        component={TestSceneRefined}
        durationInFrames={30}
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Test-Carousel-Slide-Refined"
        component={TestCarouselSlideRefined}
        durationInFrames={30}
        fps={30}
        width={1080}
        height={1350}
      />

      {/* Post 3: Instagram Story Superiority (1080x1920) */}
      <Composition
        id="Post3-Story-Superiority-Clean"
        component={StorySuperiorityClean}
        durationInFrames={30}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Post3-Story-Superiority-Raw"
        component={StorySuperiorityRaw}
        durationInFrames={30}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Post 3: Instagram Story Raw (Pure Image, No Text) */}
      <Composition
        id="Post3-Story-Raw"
        component={StoryRaw}
        durationInFrames={30}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Post 2: Carousel Slides (1080x1350, 4:5 Portrait) */}
      <Composition
        id="Post2-Carousel-Slide1"
        component={CarouselSlide1}
        durationInFrames={30}
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="Post2-Carousel-Slide2"
        component={CarouselSlide2}
        durationInFrames={30}
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="Post2-Carousel-Slide3"
        component={CarouselSlide3}
        durationInFrames={30}
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="Post2-Carousel-Slide4"
        component={CarouselSlide4}
        durationInFrames={30}
        fps={30}
        width={1080}
        height={1350}
      />

      {/* Post 3: Instagram Story Clean (1080x1920, 9:16 Portrait) */}
      <Composition
        id="Post3-Story-Clean"
        component={StoryClean}
        durationInFrames={30}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Video 5: 1080x1440 Cup vs Bottle (32.97s = 989 frames) */}
      <Composition
        id="Video5-CupVsBottle"
        component={Video5_CupVsBottle}
        durationInFrames={CUP_VS_BOTTLE_DURATION} // 989 frames = 32.966s
        fps={30}
        width={1080}
        height={1440}
      />
      {/* Video 4: 1080x1440 Order & Delivery Tutorial Reel (36.13s = 1084 frames) */}
      <Composition
        id="Video4-Tutorial"
        component={Video4_Tutorial}
        durationInFrames={TUTORIAL_DURATION} // 1084 frames = 36.13s
        fps={30}
        width={1080}
        height={1440}
      />

      {/* Video 4 VIP Club */}
      <Composition
        id="Video4-VIPClub"
        component={Video4_VIPClub}
        durationInFrames={VIP_CLUB_DURATION} // 960 frames = 32.0s
        fps={30}
        width={1080}
        height={1440}
      />

      {/* Video 3: 1080x1440 Referral Leaderboard & Rewards Reel (33.57s = 1008 frames) */}
      <Composition
        id="Video3-Leaderboard"
        component={Video3_Leaderboard}
        durationInFrames={LEADERBOARD_DURATION} // 1008 frames = 33.57s
        fps={30}
        width={1080}
        height={1440}
      />

      {/* Video 2: 1080x1440 Sapa Mart Blackout Reel (31.8s) */}
      <Composition
        id="Video2-SapaMart"
        component={Video2_SapaMart}
        durationInFrames={SAPA_DURATION} // 954 frames = 31.8s
        fps={30}
        width={1080}
        height={1440}
      />

      {/* Main: 1080x1440 Full-Bleed Animated Pixel-Art Edition (37s MP3 Pacing) */}
      <Composition
        id="Video1-TOFU"
        component={Video1_TOFU_37s}
        durationInFrames={1110} // 37.0 seconds
        fps={30}
        width={1080}
        height={1440}
      />
      <Composition
        id="Video1-TOFU-37s"
        component={Video1_TOFU_37s}
        durationInFrames={1110}
        fps={30}
        width={1080}
        height={1440}
      />
      {/* Legacy poster edition */}
      <Composition
        id="Video1-TOFU-Poster"
        component={Video1_TOFU_Poster}
        durationInFrames={745}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Carousel 1: Stevia & Sugar Crash Focus (1080x1350) */}
      <Composition id="Carousel-Stevia-1" component={SteviaSlide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Stevia-2" component={SteviaSlide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Stevia-3" component={SteviaSlide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Stevia-4" component={SteviaSlide4} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Carousel 2: Founder Story & Rp 34k Genesis (1080x1350) */}
      <Composition id="Carousel-Founder-1" component={FounderSlide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Founder-2" component={FounderSlide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Founder-3" component={FounderSlide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Founder-4" component={FounderSlide4} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Scheduled Carousel 1: SatDrop */}
      <Composition id="Carousel-SatDrop-1" component={SatDrop_Slide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-SatDrop-2" component={SatDrop_Slide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-SatDrop-3" component={SatDrop_Slide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-SatDrop-4" component={SatDrop_Slide4} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Scheduled Carousel 2: SunReset */}
      <Composition id="Carousel-SunReset-1" component={SunReset_Slide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-SunReset-2" component={SunReset_Slide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-SunReset-3" component={SunReset_Slide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-SunReset-4" component={SunReset_Slide4} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Scheduled Carousel 3: DeepWork */}
      <Composition id="Carousel-DeepWork-1" component={DeepWork_Slide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-DeepWork-2" component={DeepWork_Slide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-DeepWork-3" component={DeepWork_Slide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-DeepWork-4" component={DeepWork_Slide4} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Scheduled Carousel 4: Finance */}
      <Composition id="Carousel-Finance-1" component={Finance_Slide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Finance-2" component={Finance_Slide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Finance-3" component={Finance_Slide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Finance-4" component={Finance_Slide4} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Scheduled Carousel 5: Scarcity */}
      <Composition id="Carousel-Scarcity-1" component={Scarcity_Slide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Scarcity-2" component={Scarcity_Slide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Scarcity-3" component={Scarcity_Slide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Scarcity-4" component={Scarcity_Slide4} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Replacement Carousel: BandungDelay */}
      <Composition id="Carousel-BandungDelay-1" component={BandungDelay_Slide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-BandungDelay-2" component={BandungDelay_Slide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-BandungDelay-3" component={BandungDelay_Slide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-BandungDelay-4" component={BandungDelay_Slide4} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Reel 13 (BOFU): The Saturday Gojek COD Loop & Cooler Bag SOP */}
      <Composition
        id="LiraSaturdayCodLoop"
        component={Reel13_SaturdayCodLoop}
        durationInFrames={REEL_13_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />

      {/* Milestone 3: Editorial Instagram Carousel Engine (1080x1350, 4:5, 8 Slides) */}
      <Composition id="Carousel-Editorial-1" component={EditorialSlide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Editorial-2" component={EditorialSlide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Editorial-3" component={EditorialSlide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Editorial-4" component={EditorialSlide4} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Editorial-5" component={EditorialSlide5} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Editorial-6" component={EditorialSlide6} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Editorial-7" component={EditorialSlide7} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Editorial-8" component={EditorialSlide8} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Aliases for sample carousel rendering */}
      <Composition id="Carousel-Sample-1" component={EditorialSlide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Sample-2" component={EditorialSlide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Sample-3" component={EditorialSlide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Sample-4" component={EditorialSlide4} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Sample-5" component={EditorialSlide5} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Sample-6" component={EditorialSlide6} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Sample-7" component={EditorialSlide7} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-Sample-8" component={EditorialSlide8} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Milestone 2: Parameterized High-Retention Instagram Reel Engine (1080x1920, 9:16 @ 30fps) */}
      <Composition
        id="SampleReel-1080x1920"
        component={Reel14_ViralEngine}
        durationInFrames={REEL_14_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          headline: 'KENAPA MATCHA 50K BIKIN CRASH',
          accentWord: 'CRASH',
        }}
      />
      <Composition
        id="Reel14-ViralEngine"
        component={Reel14_ViralEngine}
        durationInFrames={REEL_14_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          headline: 'KENAPA MATCHA 50K BIKIN CRASH',
          accentWord: 'CRASH',
        }}
      />

      {/* Revised Light Studio Carousel (Dr. Murray & Brewe Standards, Option B + Option A) */}
      <Composition id="Carousel-RevisedLight-1" component={RevisedSlide1} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-RevisedLight-2" component={RevisedSlide2} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-RevisedLight-3" component={RevisedSlide3} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-RevisedLight-4" component={RevisedSlide4} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-RevisedLight-5" component={RevisedSlide5} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-RevisedLight-6" component={RevisedSlide6} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-RevisedLight-7" component={RevisedSlide7} durationInFrames={30} fps={30} width={1080} height={1350} />
      <Composition id="Carousel-RevisedLight-8" component={RevisedSlide8} durationInFrames={30} fps={30} width={1080} height={1350} />

      {/* Revised Sample Reel: 9:16 (1080x1920 @ 30fps), Without VO, 3-Tier Safe Box */}
      <Composition
        id="Reel15-RevisedSample"
        component={Reel15_RevisedSample}
        durationInFrames={REEL_15_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Reel 16: Working Video Format with Center Red Square Visual Hook (1080x1440 @ 30fps) */}
      <Composition
        id="Reel16-WorkingStyleRevamp"
        component={Reel16_WorkingStyleRevamp}
        durationInFrames={REEL_16_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />

      {/* Reel 17: Dynamic 3P Somatic Science Reel with Open-Loop & Bamboo Chasen (1080x1440 @ 30fps) */}
      <Composition
        id="Reel17-Dynamic3PSomatic"
        component={Reel17_Dynamic3PSomatic}
        durationInFrames={REEL_17_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      {/* Brand New Fresh Reel: Cup 50k Struggle & 180° Inverted Bottle Proof (1080x1440 @ 30fps) */}
      <Composition
        id="FreshReel-Cup50k"
        component={FreshReel_Cup50k}
        durationInFrames={FRESH_CUP50K_DURATION}
        fps={30}
        width={1080}
        height={1440}
      />
      {/* 100% Authentic @science_in_8bit Somatic Reel: 1080x1920 (9:16 Fullscreen @ 30fps) */}
      <Composition
        id="Reel-Science8Bit-Somatic"
        component={Reel_Science8Bit_Somatic}
        durationInFrames={SCIENCE8BIT_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
