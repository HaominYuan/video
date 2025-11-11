import { Composition, staticFile } from "remotion";
import { Audiogram } from "./Audiogram/Main";
import { audiogramSchema } from "./Audiogram/schema";
import { FPS } from "./helpers/ms-to-frame";
import { parseMedia } from "@remotion/media-parser";
import { getAudioPathAndCaptions } from "./helpers/word-to-audio";

const calculateMetadata = async ({ props }) => {
    // 获取问题的音频和字幕
    const { audioFilePath: audioQuestionFileUrl, captions: questionCaptions } =
        await getAudioPathAndCaptions(props.questionText);

    const { audioFilePath: audioAnswerFileUrl, captions: answerCaptions } =
        await getAudioPathAndCaptions(props.answerText);

    // 获取问题音频的长度
    const { slowDurationInSeconds: questionInSeconds } = await parseMedia({
        src: audioQuestionFileUrl,
        acknowledgeRemotionLicense: true,
        fields: {
            slowDurationInSeconds: true,
        },
    });

    // 获取回答音频的长度
    const { slowDurationInSeconds: answerInSeconds } = await parseMedia({
        src: audioAnswerFileUrl,
        acknowledgeRemotionLicense: true,
        fields: {
            slowDurationInSeconds: true,
        },
    });

    const { slowDurationInSeconds: thanksInSeconds } = await parseMedia({
        src: staticFile("thanks.mp3"),
        acknowledgeRemotionLicense: true,
        fields: {
            slowDurationInSeconds: true,
        },
    });

    // 返回视频的长度和一些参数
    return {
        durationInFrames: Math.ceil(
            (answerInSeconds + questionInSeconds + thanksInSeconds) * FPS,
        ),

        props: {
            ...props,
            answerCaptions,
            questionInSeconds,
            answerInSeconds,
            thanksInSeconds,
            audioQuestionFileUrl,
            audioAnswerFileUrl,
            defaultOutName: props.questionText,
        },
        fps: FPS,
    };
};

export const RemotionRoot: React.FC = () => {
    return (
        <Composition
            id="Audiogram"
            component={Audiogram}
            width={1920}
            height={1080}
            schema={audiogramSchema}
            defaultProps={{
                questionText:
                    "孔子反对铸刑鼎，是否可以理解为反对刑法？这与他推崇管仲是否有矛盾之处？",
                answerText:
                    "我是郑国一个寻常的乡民。我的祖辈和我一样，都生于这片土地，长于这片土地，我们脚下的泥土，是我们的家，我们的根。在很多年前，在我们村里，甚至在整个郑国，规矩不是写在纸上或者刻在鼎上的。规矩是融在血脉里，刻在心里的。那是一种说不清道不明，但每个人都懂得的“礼”。它就像太阳东升西落一样自然，像河水流淌一样恒常。家里的长辈会教导我们如何尊敬老人，如何对待邻里，地里的纠纷，不是靠官府的文书来判决，而是由村里最有德望、最熟悉大家情况的老人家来调解。他们不是靠律条，而是靠几十年共同生活积累的智慧，靠大家对他们的信任。他们的每一句话，都带着这方水土的温度，带着人情和道理的分量。我们知道，只要循着祖上传下来的路走，敬畏祖宗，善待乡亲，日子就不会出大错。我们的乡贤，是这片土地的守护者。他们也许不识得几个字，但他们识得每一条田埂，听得懂风吹过麦浪的声音，看得见每个人脸上的愁苦和喜悦。他们的判断，是基于他们对这片乡土深厚的理解和爱。在我们心里，他们就是公道，他们就是秩序的化身。整个村子，就像一个大家庭，虽然也有磕绊，但总能在礼的约束下，在乡贤的调解下，重归平静。然后，那年，风带来了一个消息，一个让我们这些乡下人听了，却又不明所以的消息。说是子产大人，在国都铸造了刑鼎。青铜铸成的，冰冷，沉重，上面刻满了字，据说，那就是“法”。我们最初是不明白这有什么要紧的。法？我们不是一直都讲究礼法吗？难道那些老规矩不够吗？但很快，我们就尝到了这冰冷刑鼎的味道。那些刻在青铜上的字，开始一点点地改变我们的生活。先是村里的乡贤，他们的话语不再像以前那样有分量了。来了国都派下来的官吏，他们带着公文，说着我们听不懂的官话。他们不关心你家祖上有没有规矩，不关心你和邻居是不是多年的老朋友。他们只看那铜鼎上的字，只念那文书上的条文。我记得有一次，我家几十年的老邻居，因为一点小事和另一户人家起了争执。按照以前，乡贤来了，听听前因后果，说说情理，这事也就过去了。但这次，来的官吏板着一张脸，从怀里掏出一卷东西，对着铜鼎上的字核对。他说邻居的行为触犯了哪一条哪一款，是“犯法”了。邻居是个老实巴交的农民，他不懂什么法不法，他只知道自己没做亏心事。但那官吏根本不听，只认那死板的条文，判了邻居一个严厉的刑罚。那天，邻居被带走的时候，眼神是那样的茫然和绝望。乡亲们围在旁边，个个噤若寒蝉。我们知道，这不是乡贤会做出的判决。这法，它没有温度，没有情理，它就像从天上掉下来的石头，砸碎了我们脚下的土地。更可怕的是，这些来执行“法”的官吏，往往是外乡人。他们不了解我们村子的历史，不熟悉我们的习俗，他们也瞧不上我们这些乡下人。他们只负责对照铜鼎上的字，执行上面来的命令。他们的眼睛里，只有功劳和晋升，没有我们这些活生生的人。他们就像没有根的浮萍，漂到这里，只为了完成任务，榨取一点油水，然后又漂走。而我们的乡贤，世世代代扎根在这片土地，他们的命运和我们连在一起，他们怎会忍心对自己的乡亲下这样的狠手？自从有了那刑鼎，日子似乎变得更“规矩”了，但也更冰冷，更艰难了。以前那些约定俗成的默契消失了，取而代之的是无处不在的提防和恐惧。我们不知道什么时候会因为一个无意的举动，就触犯了铜鼎上的哪一条禁令。官府的手，通过这成文的“法”，伸得越来越长，越来越细。他们可以随意地增减条文，今天这样说，明天又那样判。我们的生活不再由我们自己和我们信任的乡贤来决定，而是完全悬在了国都里那看不见的权力之上。土地的赋税越来越重，稍有迟缓，就是“犯法”。年轻人被迫去服劳役，只因为条文上写着“应征”。村子里以前的欢声笑语少了，人们变得沉默，眼神里充满了小心翼翼。乡贤们退休回家，他们的智慧被束之高阁，无人问津。我们失去了自己的守护者，变成了任由上面摆布的羔羊。那冰冷的青铜刑鼎，不仅仅是刻了字的法律条文，它是国都权力的延伸，是君主意愿的象征。它绕过了乡贤，绕过了礼法，直接将权力触角伸向了我们这些最底层的乡民。它摧毁了我们自发形成的社区秩序，便利了国君对地方的控制和剥削。我们不再是拥有自己传统的乡民，而成了律条下模糊不清的冰冷数字。我活了这么大岁数，亲眼看着这片土地如何从充满人情和礼法的温情脉脉，变成了只剩下冷酷律条和畏惧的荒原。那刑鼎的阴影，笼罩在我们每一个人的心头。后来，我听说远方的鲁国，有位叫孔丘的人，他听闻子产铸刑鼎的事，发出了叹息。他说，法就像火，人们一旦见了，就会争相追逐，想要靠它来获取利益，而不是遵从礼义。他说，有了刑鼎，人们就没有了敬畏之心。那时我还不懂这番大道理。但我用自己一辈子的经历，真真切切地懂得了，当成文法取代了习惯法，当冰冷的律条取代了有温度的礼义，当外来的官吏取代了知根知底的乡贤，失去的不仅仅是几条老规矩，失去的是人与人之间的信任，是社区自发的活力，是根植于泥土的秩序，是生而为人的尊严和敬畏。那青铜的冰冷，至今仍刻在我的记忆里，如同刻在刑鼎上的字一样，冰冷，而沉重。它带走的，是一个悲壮的，再也回不去的时代。",
                questionInSeconds: 0,
                answerInSeconds: 0,
                audioThanksFileUrl: staticFile("thanks.mp3"),
                onlyDisplayCurrentSentence: false,
                thanksInSeconds: 0,
            }}
            // Determine the length of the video based on the duration of the audio file
            // 下面这个函数主要用于渲染前计算内容的参数
            calculateMetadata={calculateMetadata}
        />
    );
};
